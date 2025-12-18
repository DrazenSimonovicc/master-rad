import { Router } from 'express';
import {
  getAllCategories,
  createCategory,
  getAllForumNews,
  getForumNewsById,
  createForumNews,
  updateForumNews,
  deleteForumNews
} from '../controllers/forum.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Categories
router.get('/categories', getAllCategories);
router.post('/categories', authenticateToken, createCategory);

// News
router.get('/news', getAllForumNews);
router.get('/news/:id', getForumNewsById);
router.post('/news', authenticateToken, createForumNews);
router.patch('/news/:id', authenticateToken, updateForumNews);
router.delete('/news/:id', authenticateToken, deleteForumNews);

export default router;

