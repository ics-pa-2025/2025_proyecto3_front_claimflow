import Cookies from 'js-cookie';
import { environment } from '../environment/environments';

const API_URL = environment.apiUrl;

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

export const chatService = {
    async getMessagesByReclamo(reclamoId: string): Promise<Mensaje[]> {
        try {
            const token = Cookies.get('access_token');
            const response = await fetch(`${API_URL}/mensaje/reclamo/${reclamoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching messages:', error);
            return [];
        }
    },

    async markAsRead(messageId: string): Promise<void> {
        try {
            const token = Cookies.get('access_token');
            await fetch(`${API_URL}/mensaje/${messageId}/read`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    },

    async getUnreadCount(reclamoId: string, tipo: 'cliente' | 'usuario'): Promise<number> {
        try {
            const token = Cookies.get('access_token');
            const response = await fetch(`${API_URL}/mensaje/reclamo/${reclamoId}/unread/${tipo}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch unread count');
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    },
};
