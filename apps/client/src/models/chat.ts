import type { User } from "./user";

export type ChatType = 'DM' | 'GROUP';

export interface Chat {
  id: number;
  type: ChatType;
  name?: string | null;
  avatarUrl?: string | null;
  updatedAt: string;
  participants: { user: User }[];
  messages: { content: string }[];
  inviteCode?: string;
  createdAt: Date;
  ownerId?: number | null;
}