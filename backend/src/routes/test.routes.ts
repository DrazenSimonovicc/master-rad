import { Router } from 'express';
import {
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest
} from '../controllers/test.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllTests);
router.get('/:id', getTestById);
router.post('/', authenticateToken, createTest);
router.patch('/:id', authenticateToken, updateTest);
router.delete('/:id', authenticateToken, deleteTest);

export default router;


