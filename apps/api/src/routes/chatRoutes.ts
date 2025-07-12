import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils';
import { ChatController } from '../controllers/chatController';
import { chatRepository, userRepository } from '../database';

const router = Router();
const chatController = new ChatController(chatRepository, userRepository);

router.use(authMiddleware);

router.get('/', asyncHandler(chatController.getChats.bind(asyncHandler)));
router.get('/:chatId', asyncHandler(chatController.getChatById.bind(chatController)));
router.post('/dm', asyncHandler(chatController.findOrCreateDM.bind(chatController)));
router.post('/groups', asyncHandler(chatController.createGroup.bind(chatController)));
router.post('/join', asyncHandler(chatController.joinGroup.bind(chatController)));
router.delete('/:chatId/leave', asyncHandler(chatController.leaveGroup.bind(chatController)));
router.delete('/:chatId', asyncHandler(chatController.hideChat.bind(chatController)));
router.patch('/groups/:chatId', asyncHandler(chatController.updateGroup.bind(chatController)));
router.post('/:chatId/pin', asyncHandler(chatController.pinChat.bind(chatController)));
router.delete('/:chatId/pin', asyncHandler(chatController.unpinChat.bind(chatController)));

export default router;