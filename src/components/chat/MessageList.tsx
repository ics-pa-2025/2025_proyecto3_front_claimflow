import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';

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

interface MessageListProps {
    messages: Mensaje[];
    isTyping: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const currentUserId = user?.id || '';

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    const isOwnMessage = (message: Mensaje) => {
        return message.emisor.id === currentUserId;
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    No hay mensajes aún. Inicia la conversación!
                </div>
            ) : (
                messages.map((message) => {
                    const isOwn = isOwnMessage(message);
                    return (
                        <div
                            key={message._id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${isOwn
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}>
                                <p className="text-sm">{message.contenido}</p>
                                <span className={`text-xs mt-1 block ${isOwn ? 'text-blue-100' : 'text-gray-500'
                                    }`}>
                                    {formatTime(message.fechaCreacion)}
                                </span>
                            </div>
                        </div>
                    );
                })
            )}

            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
                        <span className="text-sm text-gray-500">Escribiendo...</span>
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};
