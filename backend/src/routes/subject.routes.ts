import { Router } from 'express';
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subject.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllSubjects);
router.get('/:id', getSubjectById);
router.post('/', authenticateToken, createSubject);
router.patch('/:id', authenticateToken, updateSubject);
router.delete('/:id', authenticateToken, deleteSubject);

export default router;


