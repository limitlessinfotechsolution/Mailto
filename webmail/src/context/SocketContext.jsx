import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { SocketContext } from './socket';

export const SocketProvider = ({ children }) => {
  const [socket] = useState(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token && user._id) {
      // Initialize socket connection
      // Use relative path in production (proxied by Nginx), or localhost in dev
      const backendUrl = import.meta.env.PROD ? '/' : 'http://localhost:3000'; 
      
      const newSocket = io(backendUrl, {
        transports: ['websocket'],
        query: { token }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        // Join the user's room
        newSocket.emit('join', user._id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      return newSocket;
    }
    return null;
  });

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
