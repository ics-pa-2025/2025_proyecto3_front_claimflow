import { environment } from '../environment/environments';

const API_URL = `${environment.apiUrl}/tipo-reclamo`;

export interface TipoReclamo {
    _id: string;
    nombre: string;
    descripcion?: string;
    activo: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const getTiposReclamo = async (token: string): Promise<TipoReclamo[]> => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al obtener los tipos de reclamo');
    }

    return response.json();
};

export const getTipoReclamoById = async (id: string, token: string): Promise<TipoReclamo> => {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al obtener el tipo de reclamo');
    }

    return response.json();
};

export const createTipoReclamo = async (data: Partial<TipoReclamo>, token: string): Promise<TipoReclamo> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el tipo de reclamo');
    }

    return response.json();
};

export const updateTipoReclamo = async (id: string, data: Partial<TipoReclamo>, token: string): Promise<TipoReclamo> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el tipo de reclamo');
    }

    return response.json();
};

export const deleteTipoReclamo = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el tipo de reclamo');
    }
};
