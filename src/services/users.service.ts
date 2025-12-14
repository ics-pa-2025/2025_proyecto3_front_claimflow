import { environment } from '../environment/environments';
const API_URL = `${environment.authUrl}/user`;

export const getUsers = async (token: string) => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al obtener usuarios');
    }

    return response.json();
};

export const createUser = async (userData: any, token: string) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear usuario');
    }

    return response.json();
};
