import express from 'express';
import { createReply, getRepliesForPost, voteReply } from '../controllers/replyController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getRepliesForPost);
router.post('/', authenticateToken, createReply);
router.post('/:id/vote', authenticateToken, voteReply);

export default router;
