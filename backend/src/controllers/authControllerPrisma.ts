import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import { generateOtp, hashOtp, verifyOtp, getOtpExpiry, isOtpExpired } from '../utils/otp';
import { sendOtpEmail, sendWelcomeEmail } from '../services/emailService';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  uniId: z.number().int().positive('Invalid university ID'),
});

const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email format'),
  code: z.string().length(6, 'OTP code must be 6 digits'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const generateToken = (user: any) => {
  return jwt.sign(
    { 
      id: user.id, 
      uniId: user.uniId, 
      isAdmin: user.isAdmin,
      emailVerified: user.emailVerified 
    },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '24h' }
  );
};

/**
 * Register new user and send OTP
 */
export const register = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name, uniId } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Check if university exists
    const university = await prisma.university.findUnique({
      where: { id: uniId },
    });

    if (!university) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid university' 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate handle
    const handle = `Student-${Math.floor(Math.random() * 10000)}`;

    // Create user (emailVerified = false by default)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        uniId,
        handle,
        emailVerified: false,
        status: 'pending',
      },
      select: {
        id: true,
        email: true,
        name: true,
        uniId: true,
        handle: true,
        emailVerified: true,
        status: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    // Generate OTP
    const otpCode = generateOtp();
    const codeHash = hashOtp(otpCode);
    const expiresAt = getOtpExpiry();
    const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS || '5');

    // Delete any existing OTP requests for this user
    await prisma.emailOtp.deleteMany({
      where: { userId: user.id },
    });

    // Create new OTP request
    await prisma.emailOtp.create({
      data: {
        userId: user.id,
        codeHash,
        expiresAt,
        maxAttempts,
      },
    });

    // Send OTP email
    try {
      await sendOtpEmail(email, otpCode, name);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Rollback: delete user and OTP
      await prisma.emailOtp.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
      
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email. Please try again.',
      });
    }

    res.status(201).json({
      success: true,
      data: {
        user,
        requiresEmailOtp: true,
        message: 'Registration successful. Please check your email for verification code.',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Verify email OTP
 */
export const verifyEmailOtp = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = verifyOtpSchema.parse(req.body);
    const { email, code } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email already verified',
      });
    }

    // Find active OTP request
    const otpRequest = await prisma.emailOtp.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!otpRequest) {
      return res.status(404).json({
        success: false,
        error: 'No verification request found. Please request a new code.',
      });
    }

    // Check if expired
    if (isOtpExpired(otpRequest.expiresAt)) {
      await prisma.emailOtp.delete({ where: { id: otpRequest.id } });
      return res.status(400).json({
        success: false,
        error: 'Verification code expired. Please request a new code.',
      });
    }

    // Check attempt count
    if (otpRequest.attemptCount >= otpRequest.maxAttempts) {
      await prisma.emailOtp.delete({ where: { id: otpRequest.id } });
      return res.status(429).json({
        success: false,
        error: 'Too many failed attempts. Please request a new code.',
      });
    }

    // Verify OTP
    const isValid = verifyOtp(code, otpRequest.codeHash);

    if (!isValid) {
      // Increment attempt count
      await prisma.emailOtp.update({
        where: { id: otpRequest.id },
        data: { attemptCount: otpRequest.attemptCount + 1 },
      });

      const remainingAttempts = otpRequest.maxAttempts - otpRequest.attemptCount - 1;
      return res.status(400).json({
        success: false,
        error: `Invalid verification code. ${remainingAttempts} attempts remaining.`,
      });
    }

    // OTP is valid - verify user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifiedAt: new Date(),
        status: 'verified',
      },
      select: {
        id: true,
        email: true,
        name: true,
        uniId: true,
        handle: true,
        emailVerified: true,
        status: true,
        isAdmin: true,
        createdAt: true,
      },
    });

    // Delete OTP request
    await prisma.emailOtp.delete({ where: { id: otpRequest.id } });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch(err => 
      console.error('Failed to send welcome email:', err)
    );

    // Generate JWT token
    const token = generateToken(updatedUser);

    res.json({
      success: true,
      data: {
        user: updatedUser,
        token,
        message: 'Email verified successfully!',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    console.error('OTP verification error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Resend OTP code
 */
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email already verified',
      });
    }

    // Check cooldown period
    const existingOtp = await prisma.emailOtp.findFirst({
      where: { userId: user.id },
      orderBy: { lastSentAt: 'desc' },
    });

    if (existingOtp) {
      const cooldownSeconds = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || '60');
      const timeSinceLastSent = Date.now() - existingOtp.lastSentAt.getTime();
      const cooldownMs = cooldownSeconds * 1000;

      if (timeSinceLastSent < cooldownMs) {
        const waitSeconds = Math.ceil((cooldownMs - timeSinceLastSent) / 1000);
        return res.status(429).json({
          success: false,
          error: `Please wait ${waitSeconds} seconds before requesting a new code.`,
        });
      }
    }

    // Generate new OTP
    const otpCode = generateOtp();
    const codeHash = hashOtp(otpCode);
    const expiresAt = getOtpExpiry();
    const maxAttempts = parseInt(process.env.OTP_MAX_ATTEMPTS || '5');

    // Delete old OTP requests
    await prisma.emailOtp.deleteMany({
      where: { userId: user.id },
    });

    // Create new OTP request
    await prisma.emailOtp.create({
      data: {
        userId: user.id,
        codeHash,
        expiresAt,
        maxAttempts,
      },
    });

    // Send OTP email
    await sendOtpEmail(email, otpCode, user.name);

    res.json({
      success: true,
      data: {
        message: 'Verification code sent successfully. Please check your email.',
      },
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ success: false, error: 'Failed to resend verification code' });
  }
};

/**
 * Login - requires email verification
 */
export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        error: 'Please verify your email before logging in',
        requiresEmailVerification: true,
      });
    }

    // Generate token
    const token = generateToken(user);

    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors[0].message,
      });
    }
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Get current user
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        email: true,
        name: true,
        uniId: true,
        status: true,
        handle: true,
        isAdmin: true,
        emailVerified: true,
        verifiedAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  const { handle, name } = req.body;
  const userId = req.user?.id;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(handle && { handle }),
        ...(name && { name }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        uniId: true,
        status: true,
        handle: true,
        isAdmin: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Forgot Password - Send OTP to email
 * POST /auth/forgot-password
 */
export async function forgotPassword(req: Request, res: Response): Promise<any> {
  try {
    const forgotPasswordSchema = z.object({
      email: z.string().email(),
    });

    const { email } = forgotPasswordSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return res.json({
        success: true,
        message: 'If this email is registered, you will receive a password reset code.',
      });
    }

    // Generate OTP
    const code = generateOtp();
    const codeHash = await hashOtp(code);
    const expiresAt = getOtpExpiry();

    // Delete any existing OTP requests
    await prisma.emailOtp.deleteMany({
      where: { userId: user.id },
    });

    // Create new OTP request
    await prisma.emailOtp.create({
      data: {
        userId: user.id,
        codeHash,
        expiresAt,
        attemptCount: 0,
        maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '5'),
      },
    });

    // Send OTP email
    await sendOtpEmail(email, code, user.name);

    console.log(`Password reset OTP sent to: ${email}`);

    res.json({
      success: true,
      message: 'If this email is registered, you will receive a password reset code.',
      data: {
        email,
        expiresIn: parseInt(process.env.OTP_TTL_MINUTES || '10'),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process password reset request',
    });
  }
}

/**
 * Reset Password with OTP
 * POST /auth/reset-password
 */
export async function resetPassword(req: Request, res: Response): Promise<any> {
  try {
    const resetPasswordSchema = z.object({
      email: z.string().email(),
      code: z.string().length(6),
      newPassword: z.string().min(6),
    });

    const { email, code, newPassword } = resetPasswordSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Invalid email or verification code',
      });
    }

    // Find OTP request
    const otpRequest = await prisma.emailOtp.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRequest) {
      return res.status(404).json({
        success: false,
        error: 'No password reset request found. Please request a new code.',
      });
    }

    // Check if expired
    if (isOtpExpired(otpRequest.expiresAt)) {
      await prisma.emailOtp.delete({ where: { id: otpRequest.id } });
      return res.status(400).json({
        success: false,
        error: 'Reset code expired. Please request a new code.',
      });
    }

    // Check attempt count
    if (otpRequest.attemptCount >= otpRequest.maxAttempts) {
      await prisma.emailOtp.delete({ where: { id: otpRequest.id } });
      return res.status(429).json({
        success: false,
        error: 'Too many attempts. Please request a new code.',
      });
    }

    // Verify OTP
    const isValid = await verifyOtp(code, otpRequest.codeHash);

    if (!isValid) {
      // Increment attempt count
      await prisma.emailOtp.update({
        where: { id: otpRequest.id },
        data: { attemptCount: otpRequest.attemptCount + 1 },
      });

      return res.status(400).json({
        success: false,
        error: 'Invalid verification code',
        attemptsLeft: otpRequest.maxAttempts - otpRequest.attemptCount - 1,
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Delete OTP request
    await prisma.emailOtp.delete({ where: { id: otpRequest.id } });

    console.log(`Password reset successful for: ${email}`);

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.errors,
      });
    }

    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
    });
  }
}

/**
 * Delete user account - SOFT DELETE
 * Posts and replies are preserved but author is marked as "[Deleted Account]"
 */
export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    console.log(`🗑️ Starting account deletion for user ID: ${userId}`);

    // Get user details before deletion
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        name: true,
        handle: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Soft delete - mark user as deleted but keep posts and replies
    await prisma.$transaction(async (tx) => {
      // 1. Delete all email OTPs
      await tx.emailOtp.deleteMany({
        where: { userId }
      });
      console.log(`   ✓ Deleted email OTPs for user ${userId}`);

      // 2. Delete all verifications
      await tx.verification.deleteMany({
        where: { userId }
      });
      console.log(`   ✓ Deleted verifications for user ${userId}`);

      // 3. Mark user as deleted (soft delete)
      // Update handle to show it's a deleted account
      await tx.user.update({
        where: { id: userId },
        data: {
          email: `deleted_${userId}_${Date.now()}@deleted.local`,
          name: '[Deleted Account]',
          handle: '[Deleted]',
          passwordHash: '', // Clear password hash
          status: 'deleted' as any,
          emailVerified: false
        }
      });
      console.log(`   ✓ Marked user ${userId} as deleted`);
    });

    // Send account deletion confirmation email
    try {
      const emailService = await import('../services/emailService');
      await emailService.sendAccountDeletionEmail(user.email, user.name);
      console.log(`📧 Account deletion email sent to ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send account deletion email:', emailError);
      // Don't fail the request if email fails
    }

    console.log(`✅ Account soft-deletion completed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Your account has been deleted. Your posts and replies will remain visible with "[Deleted Account]" attribution.'
    });
  } catch (error) {
    console.error('❌ Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account'
    });
  }
}
