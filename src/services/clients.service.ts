export const CLIENTS_API = 'http://localhost:3000/cliente';

export const getClients = async (token: string) => {
    const response = await fetch(CLIENTS_API, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al cargar clientes');
    }

    return response.json();
};
