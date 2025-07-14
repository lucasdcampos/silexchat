import { Request, Response } from 'express';
import { IUserRepository } from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { config } from '../config';

export class AuthController {
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

      const accessTokenPayload = { id: user.id, username: user.username };
      const accessToken = jwt.sign(accessTokenPayload, config.jwtSecret!, { expiresIn: '30m' });

      const refreshToken = jwt.sign({ userId: user.id }, config.refreshTokenSecret!, { expiresIn: '15d' });

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.userRepository.update(user.id, { currentHashedRefreshToken: hashedRefreshToken });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ accessToken });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  public refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    try {
      const payload = jwt.verify(refreshToken, config.refreshTokenSecret!) as { userId: number };
      const user = await this.userRepository.findFullUserById(payload.userId);

      if (!user || !user.currentHashedRefreshToken) {
        return res.sendStatus(403);
      }

      const isTokenMatch = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
      if (!isTokenMatch) return res.sendStatus(403);

      const accessTokenPayload = { id: user.id, username: user.username };
      const newAccessToken = jwt.sign(accessTokenPayload, config.jwtSecret!, { expiresIn: '30m' });

      return res.json({ accessToken: newAccessToken });

    } catch (error) {
      return res.sendStatus(403);
    }
  }

  public logout = async (req: Request, res: Response): Promise<Response> => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    try {
      const payload = jwt.verify(refreshToken, config.refreshTokenSecret!) as { userId: number };
      await this.userRepository.update(payload.userId, { currentHashedRefreshToken: null });
    } catch (error) {
    }
    
    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' });
    return res.sendStatus(204);
  }
}