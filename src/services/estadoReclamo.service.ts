export const ESTADO_RECLAMO_API = 'http://localhost:3000/estado-reclamo';

export const getEstadosReclamo = async (token: string) => {
    const response = await fetch(ESTADO_RECLAMO_API, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al cargar estados de reclamo');
    }

    return response.json();
};

export const getEstadoReclamoById = async (id: string, token: string) => {
    const response = await fetch(`${ESTADO_RECLAMO_API}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al cargar el estado de reclamo');
    }

    return response.json();
};

export const createEstadoReclamo = async (data: any, token: string) => {
    const response = await fetch(ESTADO_RECLAMO_API, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        let message = 'Error al crear el estado de reclamo';
        try {
            const errorData = await response.json();
            message = errorData.message || message;
        } catch (e) { }
        throw new Error(message);
    }

    return response.json();
};

export const updateEstadoReclamo = async (id: string, data: any, token: string) => {
    const response = await fetch(`${ESTADO_RECLAMO_API}/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Error al actualizar el estado de reclamo');
    }

    return response.json();
};

export const deleteEstadoReclamo = async (id: string, token: string) => {
    const response = await fetch(`${ESTADO_RECLAMO_API}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al eliminar el estado de reclamo');
    }

    return response.json();
};
