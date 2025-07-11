import { Status } from "@prisma/client";

export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  publicKey: string;
  avatarUrl?: string | null;
  about?: string | null;
  status: Status;
  createdAt: Date;
}

export type PublicUser = Omit<User, 'passwordHash' | 'email' | 'publicKey'>;