import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/area';

export const getAreas = async (token?: string) => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token || Cookies.get('access_token')}`
        }
    });
    if (!response.ok) throw new Error('Error al obtener áreas');
    return response.json();
};

export const getAreaById = async (id: string, token?: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: {
            'Authorization': `Bearer ${token || Cookies.get('access_token')}`
        }
    });
    if (!response.ok) throw new Error('Error al obtener área');
    return response.json();
};

export const createArea = async (areaData: any, token?: string) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token || Cookies.get('access_token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(areaData)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear área');
    }
    return response.json();
};

export const updateArea = async (id: string, areaData: any, token?: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token || Cookies.get('access_token')}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(areaData)
    });
    if (!response.ok) throw new Error('Error al actualizar área');
    return response.json();
};

export const deleteArea = async (id: string, token?: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token || Cookies.get('access_token')}`
        }
    });
    if (!response.ok) throw new Error('Error al eliminar área');
    return response.json();
};
