import { environment } from '../environment/environments';
export const CLAIMS_API = `${environment.apiUrl}/reclamo`;

export const createClaim = async (data: FormData, token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(CLAIMS_API, {
        method: 'POST',
        headers,
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

export const getClaims = async (token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(CLAIMS_API, { headers });

    if (!response.ok) {
        throw new Error('Error al cargar reclamos');
    }

    return response.json();
};

export const getClaimById = async (id: string, token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${CLAIMS_API}/${id}`, { headers });

    if (!response.ok) {
        throw new Error('Error al cargar el reclamo');
    }

    return response.json();
};

export const updateClaim = async (id: string, data: FormData, token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${CLAIMS_API}/${id}`, {
        method: 'PATCH',
        headers,
        body: data
    });

    if (!response.ok) {
        throw new Error('Error al actualizar el reclamo');
    }

    return response.json();
};

export const updateClaimStatus = async (id: string, estadoId: string, historialEntry: { accion: string, responsable: string }, token?: string) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${CLAIMS_API}/${id}`, {
        method: 'PATCH',
        headers,
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

export const getDashboardStats = async (token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${CLAIMS_API}/dashboard/stats`, { headers });

    if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
    }

    return response.json();
};

export const getClaimsPerDay = async (token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${CLAIMS_API}/dashboard/chart-days`, { headers });

    if (!response.ok) {
        throw new Error('Error al cargar datos del gráfico');
    }

    return response.json();
};

export const getClaimsByArea = async (token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${CLAIMS_API}/dashboard/chart-areas`, { headers });

    if (!response.ok) {
        throw new Error('Error al cargar datos del gráfico de áreas');
    }

    return response.json();
};

export const getClaimsByType = async (token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${CLAIMS_API}/dashboard/chart-tipos`, { headers });

    if (!response.ok) {
        throw new Error('Error al cargar reclamos por tipo');
    }

    return response.json();
};

export const updateClaimResponsables = async (id: string, responsables: string[], historialEntry: { accion: string, responsable: string }, token?: string) => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${CLAIMS_API}/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
            responsables: responsables,
            newHistorialEntry: historialEntry
        })
    });

    if (!response.ok) {
        throw new Error('Error al actualizar los responsables del reclamo');
    }

    return response.json();
};
