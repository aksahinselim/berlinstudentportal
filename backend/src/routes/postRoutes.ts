import express from 'express';
import { getPosts, createPost, getPostById, votePost } from '../controllers/postController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, getPosts);
router.post('/', authenticateToken, createPost);
router.get('/:id', authenticateToken, getPostById);
router.post('/:id/vote', authenticateToken, votePost);

export default router;
