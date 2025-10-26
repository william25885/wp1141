import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// 公開路由（不需要認證）
router.post('/register', register);
router.post('/login', login);

// 受保護的路由（需要認證）
router.get('/me', authenticateToken, getMe);
router.post('/logout', authenticateToken, logout);

export default router;
