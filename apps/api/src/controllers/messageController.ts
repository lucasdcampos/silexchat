import { Request, Response } from 'express';
import { IMessageRepository } from '../repositories/messageRepository';
import { IChatRepository } from '../repositories/chatRepository';
import { Server } from 'socket.io';

export class MessageController {
  constructor(
    private messageRepository: IMessageRepository,
    private chatRepository: IChatRepository
  ) {}

  public getMessagesByChatId = async (req: Request, res: Response): Promise<Response> => {
    const chatId = parseInt(req.params.chatId, 10);
    const userId = (req as any).user.id;
    const isParticipant = await this.chatRepository.isUserParticipant(userId, chatId);
    if (!isParticipant) return res.status(403).json({ message: 'Access denied.' });
    const messages = await this.messageRepository.findByChatId(chatId);
    return res.status(200).json(messages);
  }

  public deleteMessage = async (req: Request, res: Response): Promise<Response> => {
    const messageId = parseInt(req.params.messageId, 10);
    const userId = (req as any).user.id;
    const message = await this.messageRepository.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found.' });
    if (message.senderId !== userId) return res.status(403).json({ message: 'Forbidden.' });
    await this.messageRepository.delete(messageId);
    const io = req.app.get('io') as Server;
    io.to(`chat:${message.chatId}`).emit('messageDeleted', { messageId, chatId: message.chatId });
    return res.status(204).send();
  }

  public markChatAsRead = async (req: Request, res: Response): Promise<Response> => {
    const chatId = parseInt(req.params.chatId, 10);
    const userId = (req as any).user.id;
    await this.messageRepository.markAsRead(chatId, userId);
    return res.status(204).send();
  }
}