import { Router } from 'express';
import { signup, login, getMe } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate, signupSchema, loginSchema } from '../middleware/validation.middleware';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticateToken, getMe);

export default router;


