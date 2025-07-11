import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from './config';
import { userRepository, chatRepository, messageRepository } from './database';

interface AuthenticatedUser {
  id: number;
  username: string;
}

const userSocketMap = new Map<number, string>();

function setupAuthMiddleware(io: Server) {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: Token not provided.'));
    }
    try {
      const decoded = jwt.verify(token, config.jwtSecret!) as AuthenticatedUser;
      (socket as any).user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token.'));
    }
  });
}

function setupConnectionEvents(io: Server) {
  io.on('connection', async (socket: Socket) => {
    const connectedUser = (socket as any).user as AuthenticatedUser;
    if (!connectedUser) return;

    console.log(`Client connected: ${connectedUser.username} (${socket.id})`);
    userSocketMap.set(connectedUser.id, socket.id);

    try {
      const user = await userRepository.updateStatus(connectedUser.id, 'ONLINE');
      io.emit('userStatusChange', { userId: user.id, status: user.status });

      const userChats = await chatRepository.findChatsByUserId(connectedUser.id);
      userChats.forEach(chat => {
        socket.join(`chat:${chat.id}`);
        console.log(`${connectedUser.username} joined room chat:${chat.id}`);
      });

    } catch(e) {
      console.error("Error during socket connection setup:", e);
    }
    
    socket.on('chatMessage', async ({ chatId, content, tempId }) => {
      try {
        const senderId = connectedUser.id;

        const chat = await chatRepository.findById(chatId);
        if (chat) {
            for (const participant of chat.participants) {
                if (participant.userId !== senderId) {
                    await chatRepository.unhideChat(participant.userId, chatId);
                }
            }
        }
        
        const newMessage = await messageRepository.create(chatId, senderId, content);

        socket.to(`chat:${chatId}`).emit('chatMessage', newMessage);

        socket.emit('messageConfirmed', { tempId, message: newMessage });
      } catch (error) {
        console.error(`Error handling chat message for chat ${chatId}:`, error);
      }
    });

    socket.on('disconnect', async () => {
      console.log(`Client disconnected: ${connectedUser.username}`);
      userSocketMap.delete(connectedUser.id);
      try {
        const user = await userRepository.updateStatus(connectedUser.id, 'OFFLINE');
        io.emit('userStatusChange', { userId: user.id, status: user.status });
      } catch(e) {
        console.error("Failed to update user status on disconnect:", e);
      }
    });
  });
}

export function setupSocketIO(io: Server) {
  setupAuthMiddleware(io);
  setupConnectionEvents(io);
}