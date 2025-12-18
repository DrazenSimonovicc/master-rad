import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.patch('/:id', authenticateToken, upload.any() as any, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;

