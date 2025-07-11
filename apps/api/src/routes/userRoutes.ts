import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils';
import { userRepository } from '../database';

const router = Router();
const userController = new UserController(userRepository);

router.post('/register', asyncHandler(userController.register.bind(userController)));
router.post('/login', asyncHandler(userController.login.bind(userController)));

router.use(authMiddleware);
router.get('/', asyncHandler(userController.getAllUsers.bind(userController)));
router.get('/:id', asyncHandler(userController.getUserProfile.bind(userController)));
router.patch('/me', asyncHandler(userController.updateProfile.bind(userController)));

export default router;