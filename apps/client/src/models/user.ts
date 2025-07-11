export interface User {
  id: number;
  username: string;
  avatarUrl?: string | null;
  about?: string | null;
  status?: 'ONLINE' | 'AFK' | 'OFFLINE';
  createdAt?: Date;
}

export interface Conversation extends User {
  unreadCount: number;
}