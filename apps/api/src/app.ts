import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import rootRoutes from './routes/rootRoutes';
import messageRoutes from './routes/messageRoutes';
import chatRoutes from './routes/chatRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/', rootRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

export { app };
