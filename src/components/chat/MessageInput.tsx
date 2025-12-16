import React, { useState } from 'react';

interface MessageInputProps {
    onSendMessage: (contenido: string) => void;
    onTyping: (isTyping: boolean) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onTyping }) => {
    const [message, setMessage] = useState('');
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);

        // Emit typing indicator
        onTyping(true);

        // Clear previous timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        // Set new timeout to stop typing indicator
        const timeout = setTimeout(() => {
            onTyping(false);
        }, 1000);

        setTypingTimeout(timeout);
    };

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
            onTyping(false);
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="border-t p-4 bg-white">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};
