import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { prisma } from '../config/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export const uploadMiddleware = upload.fields([
  { name: 'selfie', maxCount: 1 },
  { name: 'card', maxCount: 1 }
]);

/**
 * Submit verification with photo uploads
 * POST /verifications/submit
 */
export async function submitVerification(req: AuthRequest, res: Response): Promise<any> {
  try {
    console.log('📸 Verification submission started');
    console.log('   User:', req.user?.email, '(ID:', req.user?.id, ')');
    console.log('   Files:', req.files ? Object.keys(req.files) : 'No files');
    
    const userId = req.user?.id;
    const uniId = req.user?.uniId;

    if (!userId || !uniId) {
      console.error('❌ Unauthorized: Missing userId or uniId');
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Please log in again',
      });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files) {
      console.error('❌ No files received in request');
      return res.status(400).json({
        success: false,
        error: 'No files uploaded',
      });
    }

    if (!files.selfie) {
      console.error('❌ Missing selfie file');
      return res.status(400).json({
        success: false,
        error: 'Selfie photo is required',
      });
    }

    if (!files.card) {
      console.error('❌ Missing card file');
      return res.status(400).json({
        success: false,
        error: 'Student ID card photo is required',
      });
    }

    const selfieFile = files.selfie[0];
    const cardFile = files.card[0];

    console.log('📁 Selfie:', selfieFile.filename, '(', selfieFile.size, 'bytes)');
    console.log('📁 Card:', cardFile.filename, '(', cardFile.size, 'bytes)');

    // Generate URLs for uploaded files
    const selfieUrl = `/uploads/${selfieFile.filename}`;
    const cardUrl = `/uploads/${cardFile.filename}`;

    // Check for existing pending verification
    const existingVerification = await prisma.verification.findFirst({
      where: {
        userId,
        status: 'pending',
      },
    });

    if (existingVerification) {
      console.log('⚠️ User already has pending verification');
      return res.status(400).json({
        success: false,
        error: 'You already have a pending verification request',
      });
    }

    console.log('💾 Creating verification record...');
    
    // Create verification record
    const verification = await prisma.verification.create({
      data: {
        userId,
        uniId,
        selfieUrl,
        cardUrl,
        status: 'pending',
      },
    });

    console.log('✅ Verification record created (ID:', verification.id, ')');

    // DEMO MODE: Auto-approve verification
    // In production, this would require admin approval
    console.log('🎭 DEMO MODE: Auto-approving verification for user:', userId);
    
    const approvedVerification = await prisma.verification.update({
      where: { id: verification.id },
      data: { status: 'approved' },
    });

    // Update user status to verified
    await prisma.user.update({
      where: { id: userId },
      data: { status: 'verified' },
    });

    console.log('✅ User verified successfully (demo mode)');

    res.status(201).json({
      success: true,
      data: approvedVerification,
      message: 'Verification submitted and automatically approved (demo mode)',
    });
  } catch (error: any) {
    console.error('❌ Submit verification error:', error);
    console.error('   Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit verification',
    });
  }
}

/**
 * Get verifications (admin only)
 * GET /verifications
 */
export async function getVerifications(req: AuthRequest, res: Response): Promise<any> {
  try {
    const { status, userId } = req.query;

    const where: any = {};

    if (status) {
      where.status = status as string;
    }

    if (userId) {
      where.userId = parseInt(userId as string);
    }

    const verifications = await prisma.verification.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
          },
        },
        university: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: verifications,
    });
  } catch (error: any) {
    console.error('Get verifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verifications',
    });
  }
}

/**
 * Update verification status (admin only)
 * PUT /verifications/:id/status
 */
export async function updateVerificationStatus(req: AuthRequest, res: Response): Promise<any> {
  try {
    const { status } = req.body;
    const verificationId = parseInt(req.params.id);

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be "approved" or "rejected"',
      });
    }

    // Find verification
    const verification = await prisma.verification.findUnique({
      where: { id: verificationId },
    });

    if (!verification) {
      return res.status(404).json({
        success: false,
        error: 'Verification not found',
      });
    }

    // Update verification status
    const updatedVerification = await prisma.verification.update({
      where: { id: verificationId },
      data: { status },
    });

    // Update user status
    if (status === 'approved') {
      await prisma.user.update({
        where: { id: verification.userId },
        data: { status: 'verified' },
      });
    } else if (status === 'rejected') {
      await prisma.user.update({
        where: { id: verification.userId },
        data: { status: 'rejected' },
      });
    }

    res.json({
      success: true,
      data: updatedVerification,
    });
  } catch (error: any) {
    console.error('Update verification status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update verification status',
    });
  }
}

/**
 * Get user's verification status
 * GET /verifications/my-status
 */
export async function getMyVerificationStatus(req: AuthRequest, res: Response): Promise<any> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const verification = await prisma.verification.findFirst({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
    });

    res.json({
      success: true,
      data: verification || null,
    });
  } catch (error: any) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch verification status',
    });
  }
}
