import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile,
  verifyEmailOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  deleteAccount
} from '../controllers/authControllerPrisma';
import { authenticateToken } from '../middlewares/authMiddleware';
import { 
  registerLimiter, 
  loginLimiter, 
  otpVerifyLimiter, 
  otpResendLimiter 
} from '../middlewares/rateLimitMiddleware';

const router = express.Router();

// Registration & Email Verification
router.post('/register', registerLimiter, register);
router.post('/verify-email-otp', otpVerifyLimiter, verifyEmailOtp);
router.post('/resend-otp', otpResendLimiter, resendOtp);

// Login
router.post('/login', loginLimiter, login);

// Password Reset
router.post('/forgot-password', otpVerifyLimiter, forgotPassword);
router.post('/reset-password', otpVerifyLimiter, resetPassword);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);
router.delete('/account', authenticateToken, deleteAccount);

export default router;
