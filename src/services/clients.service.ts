import { environment } from '../environment/environments';
export const CLIENTS_API = `${environment.apiUrl}/cliente`;

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

export const deleteClient = async (id: string, token: string) => {
    const response = await fetch(`${CLIENTS_API}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al eliminar cliente');
    }

    return response.json();
};
