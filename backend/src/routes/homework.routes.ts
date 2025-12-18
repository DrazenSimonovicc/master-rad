import { Router } from 'express';
import {
  getAllHomework,
  getHomeworkById,
  createHomework,
  updateHomework,
  deleteHomework
} from '../controllers/homework.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllHomework);
router.get('/:id', getHomeworkById);
router.post('/', authenticateToken, createHomework);
router.patch('/:id', authenticateToken, updateHomework);
router.delete('/:id', authenticateToken, deleteHomework);

export default router;


