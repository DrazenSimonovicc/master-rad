import { Router } from 'express';
import {
  getAllOperativePlans,
  getOperativePlanById,
  createOperativePlan,
  updateOperativePlan,
  deleteOperativePlan
} from '../controllers/operativePlan.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllOperativePlans);
router.get('/:id', getOperativePlanById);
router.post('/', authenticateToken, createOperativePlan);
router.patch('/:id', authenticateToken, updateOperativePlan);
router.delete('/:id', authenticateToken, deleteOperativePlan);

export default router;


