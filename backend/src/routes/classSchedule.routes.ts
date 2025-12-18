import { Router } from 'express';
import {
  getAllClassSchedules,
  getClassScheduleById,
  createClassSchedule,
  updateClassSchedule,
  deleteClassSchedule
} from '../controllers/classSchedule.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllClassSchedules);
router.get('/:id', getClassScheduleById);
router.post('/', authenticateToken, createClassSchedule);
router.patch('/:id', authenticateToken, updateClassSchedule);
router.delete('/:id', authenticateToken, deleteClassSchedule);

export default router;


