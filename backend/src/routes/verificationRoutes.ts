import express from 'express';
import { 
  submitVerification, 
  getVerifications, 
  updateVerificationStatus,
  getMyVerificationStatus,
  uploadMiddleware 
} from '../controllers/verificationControllerPrisma';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

// User routes
router.post('/submit', authenticateToken, uploadMiddleware, submitVerification);
router.get('/my-status', authenticateToken, getMyVerificationStatus);

// Admin routes
router.get('/', authenticateToken, requireAdmin, getVerifications);
router.put('/:id/status', authenticateToken, requireAdmin, updateVerificationStatus);

export default router;
