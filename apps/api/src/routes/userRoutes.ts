import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils';
import { userRepository } from '../database';

const router = Router();
const userController = new UserController(userRepository);

router.use(authMiddleware);
router.get('/', asyncHandler(userController.getAllUsers.bind(userController)));
router.get('/profile/:id', asyncHandler(userController.getUserProfile.bind(userController)));
router.get('/username/:username', asyncHandler(userController.getUserByUsername.bind(userController)));
router.patch('/me', asyncHandler(userController.updateProfile.bind(userController)));

export default router;