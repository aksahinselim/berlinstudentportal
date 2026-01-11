import express from 'express';
import { getUniversities, getUniversityById } from '../controllers/universityController';

const router = express.Router();

router.get('/', getUniversities);
router.get('/:id', getUniversityById);

export default router;
