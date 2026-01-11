/**
 * Upload Controller - Handles file upload operations
 * 
 * Uses S3/MinIO storage with fallback to local storage
 * Uses Prisma for database operations
 */

import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../config/prisma';
import path from 'path';
import fs from 'fs';
import * as s3Service from '../services/s3Service';

// Local uploads directory (fallback)
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

interface UploadedFile {
  id: number;
  filename: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  url: string;
  storageType: 's3' | 'local';
}

/**
 * Upload files - handles multipart form data
 * Currently uses LOCAL STORAGE (S3/MinIO disabled)
 * POST /api/uploads
 */
export const uploadFiles = async (req: AuthRequest, res: Response) => {
  try {
    console.log('📤 Upload request received');
    console.log('   Files:', req.files ? (req.files as Express.Multer.File[]).length : 0);
    
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      console.log('❌ No files in request');
      return res.status(400).json({ 
        success: false, 
        error: 'No files uploaded' 
      });
    }

    const uploadedFiles: UploadedFile[] = [];
    
    // Check S3 availability (will return false if S3_ENDPOINT not set)
    const useS3 = await s3Service.isS3Available();
    console.log(`📁 Storage mode: ${useS3 ? 'S3/MinIO' : 'LOCAL'}`);

    for (const file of req.files as Express.Multer.File[]) {
      console.log(`   Processing: ${file.originalname} (${file.size} bytes)`);
      
      let filename: string;
      let url: string;
      let storageType: 's3' | 'local' = 'local';

      // Determine file type from extension
      const ext = path.extname(file.originalname).toLowerCase();
      let fileType = 'other';
      if (ext === '.pdf') fileType = 'pdf';
      else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) fileType = 'image';
      else if (['.doc', '.docx'].includes(ext)) fileType = 'docx';

      // FORCE LOCAL STORAGE for now (S3 disabled in docker-compose)
      // Generate unique filename
      filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalname}`;
      const filePath = path.join(uploadsDir, filename);
      
      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);
      url = `/uploads/${filename}`;
      storageType = 'local';
      
      console.log(`   ✅ Saved to: ${filePath}`);

      // Insert into database using Prisma
      const attachment = await prisma.attachment.create({
        data: {
          filename,
          originalName: file.originalname,
          fileType,
          fileSize: file.size,
          filePath: url,
          storageType: 'local' // ALWAYS local
        }
      });

      console.log(`   ✅ DB record created: ID ${attachment.id}`);

      uploadedFiles.push({
        id: attachment.id,
        filename: attachment.filename,
        originalName: attachment.originalName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
        url: attachment.filePath,
        storageType: 'local'
      });
    }

    console.log(`✅ Upload complete: ${uploadedFiles.length} files`);
    
    res.status(201).json({
      success: true,
      data: uploadedFiles
    });
  } catch (err: any) {
    console.error('❌ Upload error:', err);
    res.status(500).json({ 
      success: false, 
      error: `Failed to upload files: ${err.message}` 
    });
  }
};

/**
 * Download file from S3 or local storage
 * GET /api/uploads/download/:filename
 */
export const downloadFile = async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;

    // Get attachment info from database using Prisma
    const attachment = await prisma.attachment.findFirst({
      where: { filename }
    });

    if (!attachment) {
      return res.status(404).json({ 
        success: false, 
        error: 'File not found' 
      });
    }

    if (attachment.storageType === 's3') {
      // Download from S3
      try {
        const buffer = await s3Service.downloadFromS3(filename);
        
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalName}"`);
        res.send(buffer);
      } catch (s3Err) {
        console.error('S3 download failed:', s3Err);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to download file from storage' 
        });
      }
    } else {
      // Serve from local storage
      const filePath = path.join(uploadsDir, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          success: false, 
          error: 'File not found on server' 
        });
      }

      res.download(filePath, attachment.originalName);
    }
  } catch (err: any) {
    console.error('Download error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

/**
 * Get attachment info
 * GET /api/uploads/:id
 */
export const getAttachment = async (req: AuthRequest, res: Response) => {
  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!attachment) {
      return res.status(404).json({ 
        success: false, 
        error: 'Attachment not found' 
      });
    }

    res.json({
      success: true,
      data: {
        id: attachment.id,
        filename: attachment.filename,
        originalName: attachment.originalName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
        url: attachment.filePath,
        storageType: attachment.storageType,
        createdAt: attachment.createdAt
      }
    });
  } catch (err: any) {
    console.error('Get attachment error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

/**
 * Delete attachment
 * DELETE /api/uploads/:id
 */
export const deleteAttachment = async (req: AuthRequest, res: Response) => {
  try {
    // Get attachment info first
    const attachment = await prisma.attachment.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!attachment) {
      return res.status(404).json({ 
        success: false, 
        error: 'Attachment not found' 
      });
    }

    // Delete file from storage
    if (attachment.storageType === 's3') {
      try {
        await s3Service.deleteFromS3(attachment.filename);
      } catch (s3Err) {
        console.error('S3 delete failed:', s3Err);
        // Continue to delete from database anyway
      }
    } else {
      // Delete from local storage
      const filePath = path.join(uploadsDir, attachment.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete from database using Prisma
    await prisma.attachment.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({
      success: true,
      message: 'Attachment deleted successfully'
    });
  } catch (err: any) {
    console.error('Delete attachment error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
};

/**
 * Check S3/storage connection status
 * GET /api/uploads/ftp/status (kept for backwards compatibility)
 */
export const checkFTPStatus = async (req: AuthRequest, res: Response) => {
  try {
    const isS3Connected = await s3Service.isS3Available();
    
    res.json({
      success: true,
      data: {
        configured: !!process.env.S3_ENDPOINT,
        connected: isS3Connected,
        storageType: isS3Connected ? 's3' : 'local',
        message: isS3Connected ? 'S3/MinIO connection successful' : 'Using local storage'
      }
    });
  } catch (err: any) {
    console.error('Storage status check error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to check storage status' 
    });
  }
};

/**
 * List files in storage
 * GET /api/uploads/ftp/files (kept for backwards compatibility)
 */
export const listFTPFiles = async (req: AuthRequest, res: Response) => {
  try {
    const isS3 = await s3Service.isS3Available();
    
    res.json({
      success: true,
      data: {
        storage: isS3 ? 's3' : 'local',
        files: fs.readdirSync(uploadsDir)
      }
    });
  } catch (err: any) {
    console.error('List files error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to list files' 
    });
  }
};

/**
 * Get file URL for download/preview
 * GET /api/uploads/:id/url
 * 
 * IMPORTANT: S3/MinIO is DISABLED - only local storage is used
 * All files are served from /uploads/ via nginx proxy
 */
export const getPresignedFileUrl = async (req: AuthRequest, res: Response) => {
  try {
    const attachmentId = parseInt(req.params.id);
    
    console.log(`📎 Getting file URL for attachment ID: ${attachmentId}`);
    
    // Get attachment info from database
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId }
    });

    if (!attachment) {
      console.error(`❌ Attachment ${attachmentId} not found in database`);
      return res.status(404).json({ 
        success: false, 
        error: 'Dosya veritabanında bulunamadı' 
      });
    }

    console.log(`✅ Attachment found: ${attachment.filename}, storage: ${attachment.storageType}`);

    // ALWAYS use local storage - S3/MinIO is disabled
    const filePath = path.join(uploadsDir, attachment.filename);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found on disk: ${filePath}`);
      
      // If storage type was s3, inform user the file is from old system
      if (attachment.storageType === 's3') {
        return res.status(404).json({ 
          success: false, 
          error: 'Bu dosya eski sistemde yüklenmişti ve artık erişilemiyor. Lütfen yeniden yükleyin.' 
        });
      }
      
      return res.status(404).json({ 
        success: false, 
        error: 'Dosya sunucuda bulunamadı. Silinmiş olabilir.' 
      });
    }
    
    // Return direct download URL (nginx will proxy this)
    const url = `/uploads/${attachment.filename}`;
    console.log(`📁 Using local storage URL: ${url}`);

    res.json({
      success: true,
      data: {
        id: attachment.id,
        filename: attachment.filename,
        originalName: attachment.originalName,
        fileType: attachment.fileType,
        fileSize: attachment.fileSize,
        url,
        expiresIn: null
      }
    });
  } catch (err: any) {
    console.error('❌ Get file URL error:', err);
    res.status(500).json({ 
      success: false, 
      error: 'Sunucu hatası' 
    });
  }
};
