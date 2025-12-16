import { environment } from '../environment/environments';
export const CLAIMS_API = `${environment.apiUrl}/reclamo`;

export const createClaim = async (data: FormData, token: string) => {
    const response = await fetch(CLAIMS_API, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // Content-Type is set automatically by browser for FormData
        },
        body: data
    });

    if (!response.ok) {
        let message = 'Error al crear el reclamo';
        try {
            const errorData = await response.json();
            message = errorData.message || message;
        } catch (e) { }
        throw new Error(message);
    }

    return response.json();
};

export const getClaims = async (token: string) => {
    const response = await fetch(CLAIMS_API, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al cargar reclamos');
    }

    return response.json();
};

export const getClaimById = async (id: string, token: string) => {
    const response = await fetch(`${CLAIMS_API}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al cargar el reclamo');
    }

    return response.json();
};

export const updateClaim = async (id: string, data: FormData, token: string) => {
    const response = await fetch(`${CLAIMS_API}/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: data
    });

    if (!response.ok) {
        throw new Error('Error al actualizar el reclamo');
    }

    return response.json();
};

export const updateClaimStatus = async (id: string, estadoId: string, historialEntry: { accion: string, responsable: string }, token: string) => {
    const response = await fetch(`${CLAIMS_API}/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            estado: estadoId,
            newHistorialEntry: historialEntry
        })
    });

    if (!response.ok) {
        throw new Error('Error al actualizar el estado del reclamo');
    }

    return response.json();
};

export const getDashboardStats = async (token: string) => {
    const response = await fetch(`${CLAIMS_API}/dashboard/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
    }

    return response.json();
};
