import { Request, Response } from 'express';
import { IUserRepository } from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { config } from '../config';

export class UserController {
  constructor(private userRepository: IUserRepository) {}
  public updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as any).user.id;
      const { username, avatarUrl, about, status } = req.body;

      if (username) {
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ message: 'Username already taken.' });
        }
      }

      const updatedUser = await this.userRepository.update(userId, { username, avatarUrl, about, status });
      
      const tokenPayload = { 
        id: updatedUser.id, 
        username: updatedUser.username, 
        avatarUrl: updatedUser.avatarUrl,
        about: updatedUser.about,
        status: updatedUser.status
      };
      const newToken = jwt.sign(tokenPayload, config.jwtSecret!, { expiresIn: '1h' });

      return res.status(200).json({ user: tokenPayload, token: newToken });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public getUserProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID.' });
      }
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public getUserByUsername = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username } = req.params;
      const user = await this.userRepository.findByUsername(username);

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const publicUserData = {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
        about: user.about,
        status: user.status,
        createdAt: user.createdAt,
      };

      return res.status(200).json(publicUserData);
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await this.userRepository.findAll();
      return res.status(200).json(users);
    } catch (error) {
      console.error('Get all users error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
}