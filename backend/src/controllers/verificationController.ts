import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createVerification = async (req: AuthRequest, res: Response) => {
  const { uniId, selfieUrl, cardUrl } = req.body;
  const userId = req.user?.id;

  try {
    // Check existing pending
    const existing = await prisma.verification.findFirst({
      where: {
        userId: userId!,
        status: 'pending'
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, error: 'Pending verification already exists' });
    }

    const verification = await prisma.verification.create({
      data: {
        userId: userId!,
        uniId: parseInt(uniId),
        selfieUrl,
        cardUrl
      }
    });

    // Transform to match expected API format
    const response = {
      id: verification.id,
      user_id: verification.userId,
      uni_id: verification.uniId,
      selfie_url: verification.selfieUrl,
      card_url: verification.cardUrl,
      status: verification.status,
      submitted_at: verification.submittedAt
    };

    res.status(201).json({
      success: true,
      data: response
    });
  } catch (err: any) {
    console.error('Create verification error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getVerifications = async (req: AuthRequest, res: Response) => {
  const { status, userId } = req.query;

  try {
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (userId) {
      where.userId = parseInt(userId as string);
    }

    const verifications = await prisma.verification.findMany({
      where,
      orderBy: { submittedAt: 'desc' }
    });

    // Transform to match expected API format
    const response = verifications.map(v => ({
      id: v.id,
      user_id: v.userId,
      uni_id: v.uniId,
      selfie_url: v.selfieUrl,
      card_url: v.cardUrl,
      status: v.status,
      submitted_at: v.submittedAt
    }));

    res.json({
      success: true,
      data: response
    });
  } catch (err: any) {
    console.error('Get verifications error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateVerificationStatus = async (req: AuthRequest, res: Response) => {
  const { status } = req.body; // approved or rejected
  const verificationId = parseInt(req.params.id);

  try {
    const verification = await prisma.verification.update({
      where: { id: verificationId },
      data: { status }
    });

    // If approved or rejected, update user status
    if (status === 'approved') {
      await prisma.user.update({
        where: { id: verification.userId },
        data: { status: 'verified' }
      });
    } else if (status === 'rejected') {
      await prisma.user.update({
        where: { id: verification.userId },
        data: { status: 'rejected' }
      });
    }

    // Transform to match expected API format
    const response = {
      id: verification.id,
      user_id: verification.userId,
      uni_id: verification.uniId,
      selfie_url: verification.selfieUrl,
      card_url: verification.cardUrl,
      status: verification.status,
      submitted_at: verification.submittedAt
    };

    res.json({
      success: true,
      data: response
    });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Verification not found' });
    }
    console.error('Update verification error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
