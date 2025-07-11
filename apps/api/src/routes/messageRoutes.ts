import { Router } from 'express';
import { MessageController } from '../controllers/messageController';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils';
import { chatRepository, messageRepository } from '../database';

const router = Router();

const messageController = new MessageController(messageRepository, chatRepository);

router.use(authMiddleware);

router.get('/:chatId', asyncHandler(messageController.getMessagesByChatId.bind(messageController)));
router.post('/:chatId/read', asyncHandler(messageController.markChatAsRead.bind(messageController)));
router.delete('/:messageId', asyncHandler(messageController.deleteMessage.bind(messageController)));

export default router;