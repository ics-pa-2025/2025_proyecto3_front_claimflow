import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  joinRoom: (reclamoId: string) => void;
  leaveRoom: (reclamoId: string) => void;
  sendMessage: (reclamoId: string, contenido: string) => void;
  sendTyping: (reclamoId: string, isTyping: boolean) => void;
}

export const useSocket = (): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token || !user) {
      console.error('No token or user found');
      return;
    }

    try {
      const userRole = user.role?.name || 'client';

      // Initialize socket connection
      const socket = io('http://localhost:3000', {
        auth: {
          token,
          userId: user.id,
          userName: user.name,
          userRole,
        },
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

      socketRef.current = socket;

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }, [user]);

  const joinRoom = (reclamoId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('joinRoom', { reclamoId });
    }
  };

  const leaveRoom = (reclamoId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leaveRoom', { reclamoId });
    }
  };

  const sendMessage = (reclamoId: string, contenido: string) => {
    if (socketRef.current) {
      socketRef.current.emit('sendMessage', { reclamoId, contenido });
    }
  };

  const sendTyping = (reclamoId: string, isTyping: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { reclamoId, isTyping });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
  };
};
