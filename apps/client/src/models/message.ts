import type { User } from './user';

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  senderId: number;
  chatId: number;
  sender?: User;
}