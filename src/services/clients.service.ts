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

export const updateClient = async (id: string, clientData: any, token: string) => {
    const response = await fetch(`${CLIENTS_API}/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
    });

    if (!response.ok) {
        throw new Error('Error al actualizar cliente');
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

export const getClientProjects = async (clientId: string, token: string) => {
    const response = await fetch(`${CLIENTS_API}/${clientId}/proyectos`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al cargar proyectos');
    }

    return response.json();
};
