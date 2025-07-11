import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { app } from './app';
import { config } from './config';
import { setupSocketIO } from './socket';

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

app.set('io', io);

setupSocketIO(io);

server.listen(config.port, () => {
  console.log(`Silex server running on port ${config.port}`);
});
