import { PrismaClient } from '@prisma/client';
import { UserRepository } from './repositories/userRepository';
import { ChatRepository } from './repositories/chatRepository';
import { MessageRepository } from './repositories/messageRepository';

export const prisma = new PrismaClient();

export const userRepository = new UserRepository();
export const chatRepository = new ChatRepository();
export const messageRepository = new MessageRepository();