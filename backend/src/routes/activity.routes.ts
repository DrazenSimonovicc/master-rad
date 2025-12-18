import { Router } from 'express';
import {
  getAllActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity
} from '../controllers/activity.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllActivities);
router.get('/:id', getActivityById);
router.post('/', authenticateToken, createActivity);
router.patch('/:id', authenticateToken, updateActivity);
router.delete('/:id', authenticateToken, deleteActivity);

export default router;


