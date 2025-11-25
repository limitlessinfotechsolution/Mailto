import { Server } from 'socket.io';
import { logger } from '@mailo/shared';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow all origins for now, restrict in production
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on('join', (userId) => {
      socket.join(userId);
      logger.info(`Socket ${socket.id} joined room ${userId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
