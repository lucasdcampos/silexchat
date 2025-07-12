import type { User } from "./user";

export type ChatType = 'DM' | 'GROUP';

export interface Chat {
  id: number;
  type: ChatType;
  name?: string | null;
  avatarUrl?: string | null;
  updatedAt: string;
  participants: ChatParticipant[]
  messages: { content: string }[];
  inviteCode?: string;
  createdAt: Date;
  ownerId?: number | null;
}

export interface ChatParticipant {
  userId: number;
  chatId: number;
  isHidden: boolean;
  isPinned: boolean;
  user: User;
}