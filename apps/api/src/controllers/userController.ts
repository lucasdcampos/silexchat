import { Request, Response } from 'express';
import { IUserRepository } from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { config } from '../config';

export class UserController {
  constructor(private userRepository: IUserRepository) {}

  public register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username, email, password, publicKey, avatarUrl } = req.body;
      if (!username || !email || !password || !publicKey) {
        return res.status(400).json({ message: 'Username, email, password, and publicKey are required.' });
      }

      if (await this.userRepository.findByUsername(username)) {
        return res.status(409).json({ message: 'Username already taken.' });
      }
      if (await this.userRepository.findByEmail(email)) {
        return res.status(409).json({ message: 'Email already in use.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await this.userRepository.create({ username, email, passwordHash, publicKey, avatarUrl });

      return res.status(201).json({ id: newUser.id, username: newUser.username });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      const user = await this.userRepository.findByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const tokenPayload = { 
        id: user.id, 
        username: user.username, 
        avatarUrl: user.avatarUrl,
        about: user.about,
        status: user.status
      };
      const token = jwt.sign(tokenPayload, config.jwtSecret!, { expiresIn: '1h' });

      return res.status(200).json({ token });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

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