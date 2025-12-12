
const USERS_API = 'http://localhost:3001/user';

export const getUsers = async (token: string) => {
    const response = await fetch(USERS_API, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al cargar usuarios');
    }

    return response.json();
};
