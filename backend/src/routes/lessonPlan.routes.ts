import { Router } from 'express';
import {
  getAllLessonPlans,
  getLessonPlanById,
  createLessonPlan,
  updateLessonPlan,
  deleteLessonPlan
} from '../controllers/lessonPlan.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllLessonPlans);
router.get('/:id', getLessonPlanById);
router.post('/', authenticateToken, createLessonPlan);
router.patch('/:id', authenticateToken, updateLessonPlan);
router.delete('/:id', authenticateToken, deleteLessonPlan);

export default router;

