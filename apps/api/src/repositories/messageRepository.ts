import { prisma } from '../database';
import { Message } from '@prisma/client';

export interface IMessageRepository {
  create(chatId: number, senderId: number, content: string): Promise<Message>;
  findById(id: number): Promise<Message | null>;
  findByChatId(chatId: number): Promise<any[]>
  delete(id: number): Promise<void>;
  markAsRead(recipientId: number, senderId: number): Promise<void>;
}

export class MessageRepository implements IMessageRepository {
  async create(chatId: number, senderId: number, content: string): Promise<any> {
    return prisma.$transaction(async (tx) => {
      const newMessage = await tx.message.create({
        data: { chatId, senderId, content },
        include: {
          sender: { select: { id: true, username: true, avatarUrl: true } },
        },
      });
      await tx.chat.update({
        where: { id: chatId },
        data: { updatedAt: new Date() },
      });
      return newMessage;
    });
  }

  async findByChatId(chatId: number): Promise<any[]> {
    return prisma.message.findMany({
      where: { chatId },
      include: {
        sender: { select: { id: true, username: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(id: number): Promise<Message | null> {
    return prisma.message.findUnique({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await prisma.message.delete({ where: { id } });
  }

  async markAsRead(chatId: number, userId: number): Promise<void> {
    const messagesToMark = await prisma.message.findMany({
      where: {
        chatId: chatId,
        senderId: { not: userId },
        readBy: { none: { userId: userId } },
      },
      select: { id: true },
    });

    if (messagesToMark.length === 0) return;

    await prisma.readReceipt.createMany({
      data: messagesToMark.map(msg => ({ messageId: msg.id, userId: userId })),
      skipDuplicates: true,
    });
  }
}