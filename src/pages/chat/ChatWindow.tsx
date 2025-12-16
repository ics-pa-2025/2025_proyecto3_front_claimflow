import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket';
import { chatService } from '../../services/chatService';
import { MessageList } from '../../components/chat/MessageList';
import { MessageInput } from '../../components/chat/MessageInput';
import { MessageCircle } from 'lucide-react';

interface Mensaje {
    _id: string;
    contenido: string;
    emisor: {
        tipo: 'cliente' | 'usuario';
        id: string;
        nombre?: string;
    };
    reclamoId: string;
    leido: boolean;
    fechaCreacion: string;
}

export const ChatWindow: React.FC = () => {
    const { reclamoId } = useParams<{ reclamoId: string }>();
    const navigate = useNavigate();
    const { socket, isConnected, joinRoom, leaveRoom, sendMessage, sendTyping } = useSocket();
    const [messages, setMessages] = useState<Mensaje[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!reclamoId) {
            navigate('/chat');
            return;
        }

        // Load message history
        const loadMessages = async () => {
            setLoading(true);
            const history = await chatService.getMessagesByReclamo(reclamoId);
            setMessages(history);
            setLoading(false);
        };

        loadMessages();

        // Join room when connected
        if (isConnected && socket) {
            joinRoom(reclamoId);
        }

        return () => {
            if (reclamoId) {
                leaveRoom(reclamoId);
            }
        };
    }, [reclamoId, isConnected]);

    useEffect(() => {
        if (!socket) return;

        // Listen for new messages
        const handleNewMessage = (message: Mensaje) => {
            setMessages((prev) => [...prev, message]);
        };

        // Listen for typing indicator
        const handleUserTyping = ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
            setIsTyping(isTyping);
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('userTyping', handleUserTyping);

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('userTyping', handleUserTyping);
        };
    }, [socket]);

    const handleSendMessage = (contenido: string) => {
        if (reclamoId) {
            sendMessage(reclamoId, contenido);
        }
    };

    const handleTyping = (isTypingNow: boolean) => {
        if (reclamoId) {
            sendTyping(reclamoId, isTypingNow);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Cargando chat...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 -m-6">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 shadow-sm flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => navigate('/chat')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← Volver
                        </button>
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Chat - Reclamo #{reclamoId?.slice(-6)}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {isConnected ? (
                                    <span className="text-green-600">● Conectado</span>
                                ) : (
                                    <span className="text-red-600">● Desconectado</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <MessageList messages={messages} isTyping={isTyping} />

            {/* Input */}
            <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
        </div>
    );
};
