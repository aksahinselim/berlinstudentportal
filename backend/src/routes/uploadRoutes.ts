/**
 * Upload Routes - File upload endpoints with FTP support
 */

import express from 'express';
import multer from 'multer';
import { 
  uploadFiles, 
  getAttachment, 
  deleteAttachment, 
  downloadFile,
  checkFTPStatus,
  listFTPFiles,
  getPresignedFileUrl
} from '../controllers/uploadController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

// Configure multer for memory storage (we handle file writing in controller)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 5 // Max 5 files at once
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  }
});

// File upload/download routes
router.post('/', authenticateToken, upload.array('files', 5), uploadFiles);
router.get('/download/:filename', authenticateToken, downloadFile);
router.get('/:id', authenticateToken, getAttachment);
router.get('/:id/url', authenticateToken, getPresignedFileUrl); // Presigned URL for file sharing
router.delete('/:id', authenticateToken, deleteAttachment);

// FTP management routes
router.get('/ftp/status', authenticateToken, checkFTPStatus);
router.get('/ftp/files', authenticateToken, listFTPFiles);

export default router;
