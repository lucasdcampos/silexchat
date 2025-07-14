import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rootRoutes from './routes/rootRoutes';
import messageRoutes from './routes/messageRoutes';
import chatRoutes from './routes/chatRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/', rootRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

export { app };
