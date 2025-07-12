import { Request, Response } from 'express';
import { IChatRepository } from "../repositories/chatRepository";
import { IUserRepository } from "../repositories/userRepository";

export class ChatController {
  constructor(
    private chatRepository: IChatRepository,
    private userRepository: IUserRepository
  ) {}

  public getChats = async (req: Request, res: Response): Promise<Response> => {
    const userId = (req as any).user.id;
    const chats = await this.chatRepository.findChatsByUserId(userId);
    return res.status(200).json(chats);
  }

  public getChatById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const chatId = parseInt(req.params.chatId, 10);
      const userId = (req as any).user.id;
      
      const isParticipant = await this.chatRepository.isUserParticipant(userId, chatId);
      if (!isParticipant) {
        return res.status(403).json({ message: 'Access denied.' });
      }

      const chat = await this.chatRepository.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: 'Chat not found.' });
      }
      
      return res.status(200).json(chat);
    } catch (error) {
      console.error('Error fetching chat by ID:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public createGroup = async (req: Request, res: Response): Promise<Response> => {
    const { name, avatarUrl } = req.body;
    const ownerId = (req as any).user.id;
    if (!name) return res.status(400).json({ message: 'Group name is required.' });
    const newGroup = await this.chatRepository.createGroup(ownerId, name, avatarUrl);
    return res.status(201).json(newGroup);
  }

  public findOrCreateDM = async (req: Request, res: Response): Promise<Response> => {
    const { partnerUsername } = req.body;
    const userId = (req as any).user.id;
    if (!partnerUsername) return res.status(400).json({ message: 'Partner username is required.' });
    const partner = await this.userRepository.findByUsername(partnerUsername);
    if (!partner) return res.status(404).json({ message: 'User not found.' });
    if (partner.id === userId) return res.status(400).json({ message: 'You cannot start a chat with yourself.' });
    const chat = await this.chatRepository.findOrCreateDM(userId, partner.id);
    return res.status(200).json(chat);
  }

  public joinGroup = async (req: Request, res: Response): Promise<Response> => {
    const { inviteCode } = req.body;
    const userId = (req as any).user.id;
    if (!inviteCode) return res.status(400).json({ message: 'Invite code is required.' });
    const group = await this.chatRepository.joinWithInviteCode(userId, inviteCode);
    if (!group) return res.status(404).json({ message: 'Group not found or invite code is invalid.' });
    return res.status(200).json(group);
  }

  public leaveGroup = async (req: Request, res: Response): Promise<Response> => {
    const chatId = parseInt(req.params.chatId, 10);
    const userId = (req as any).user.id;
    try {
      await this.chatRepository.leave(userId, chatId);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(403).json({ message: error.message });
    }
  }

  public hideChat = async (req: Request, res: Response): Promise<Response> => {
    const chatId = parseInt(req.params.chatId, 10);
    const userId = (req as any).user.id;
    await this.chatRepository.hideChat(userId, chatId);
    return res.status(204).send();
  }

  public pinChat = async (req: Request, res: Response): Promise<Response> => {
    try {
      const chatId = parseInt(req.params.chatId, 10);
      const userId = (req as any).user.id;
      await this.chatRepository.pinChat(userId, chatId);
      return res.status(204).send();
    } catch (error) {
      console.error('Error pinning chat:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public unpinChat = async (req: Request, res: Response): Promise<Response> => {
    try {
      const chatId = parseInt(req.params.chatId, 10);
      const userId = (req as any).user.id;
      await this.chatRepository.unpinChat(userId, chatId);
      return res.status(204).send();
    } catch (error) {
      console.error('Error unpinning chat:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public updateGroup = async (req: Request, res: Response): Promise<Response> => {
    try {
      const chatId = parseInt(req.params.chatId, 10);
      const ownerId = (req as any).user.id;
      const { name, avatarUrl } = req.body;

      if (!name && avatarUrl === undefined) {
        return res.status(400).json({ message: 'At least name or avatarUrl must be provided.' });
      }

      const updatedGroup = await this.chatRepository.updateGroup(chatId, ownerId, { name, avatarUrl });
      
      return res.status(200).json(updatedGroup);

    } catch (error: any) {
      if (error.message.includes('Only the owner')) {
        return res.status(403).json({ message: error.message });
      }
      console.error('Error updating group:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
}