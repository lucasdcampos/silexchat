import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils';
import { userRepository } from '../database';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController(userRepository);

router.post('/register', asyncHandler(authController.register.bind(authController)));
router.post('/login', asyncHandler(authController.login.bind(authController)));
router.post('/refresh', asyncHandler(authController.refreshToken.bind(authController)))
router.post('/logout', asyncHandler(authController.logout.bind(authController)));

router.use(authMiddleware);

export default router;