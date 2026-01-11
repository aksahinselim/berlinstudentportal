import express from 'express';
import { 
  register, 
  login, 
  getMe, 
  updateProfile,
  verifyEmailOtp,
  resendOtp
} from '../controllers/authControllerPrisma';
import { authenticateToken } from '../middlewares/authMiddleware';
import { 
  registerLimiter, 
  loginLimiter, 
  otpVerifyLimiter, 
  otpResendLimiter 
} from '../middlewares/rateLimitMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/verify-email-otp', otpVerifyLimiter, verifyEmailOtp);
router.post('/resend-otp', otpResendLimiter, resendOtp);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, updateProfile);

export default router;
