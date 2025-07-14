import { PublicUser, User } from '../models/user';
import { prisma } from '../database';
import { Status } from '@prisma/client';

export interface IUserRepository {
  create(data: Omit<User, 'id' | 'createdAt' | 'status'>): Promise<User>;
  findById(id: number): Promise<PublicUser | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAll(): Promise<PublicUser[]>;
  update(id: number, data: { 
    username?: string; 
    avatarUrl?: string; 
    about?: string; 
    status?: Status, 
    currentHashedRefreshToken?: string | null;}
  ): Promise<User>;
  updateStatus(id: number, status: Status): Promise<User>;
  findFullUserById(id: number): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
  async create(data: Omit<User, 'id' | 'createdAt' | 'status' | 'currentHashedRefreshToken'>): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: number): Promise<PublicUser | null> {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        about: true,
        status: true,
        createdAt: true,
        email: true,
      },
    });
  }

  async findFullUserById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { username } });
  }

  async findAll(): Promise<PublicUser[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        about: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async update(id: number, data: { username?: string; avatarUrl?: string; about?: string; status?: Status; currentHashedRefreshToken?: string | null; }): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: number, status: Status): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { status },
    });
  }
}