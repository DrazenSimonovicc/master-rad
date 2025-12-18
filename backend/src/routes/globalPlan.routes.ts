import { Router } from 'express';
import {
  getAllGlobalPlans,
  getGlobalPlanById,
  createGlobalPlan,
  updateGlobalPlan,
  deleteGlobalPlan,
  getAllGlobalPlanSubjects,
  createGlobalPlanSubject
} from '../controllers/globalPlan.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Global Plans
router.get('/', getAllGlobalPlans);
router.get('/:id', getGlobalPlanById);
router.post('/', authenticateToken, createGlobalPlan);
router.patch('/:id', authenticateToken, updateGlobalPlan);
router.delete('/:id', authenticateToken, deleteGlobalPlan);

// Global Plan Subjects
router.get('/subjects/all', getAllGlobalPlanSubjects);
router.post('/subjects', authenticateToken, createGlobalPlanSubject);

export default router;


