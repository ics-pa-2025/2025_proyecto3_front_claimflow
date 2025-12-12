import { Role } from '../types';

const API_URL = 'http://localhost:3001/roles';

export const getRoles = async (token: string): Promise<Role[]> => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al obtener los roles');
    }

    return response.json();
};
