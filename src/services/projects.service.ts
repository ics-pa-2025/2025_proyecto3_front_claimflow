export const getProjectsByClient = async (clienteId: string, token: string) => {
    const response = await fetch(`${PROJECTS_API}/cliente/${clienteId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Error al cargar proyectos del cliente');
    }
    return response.json();
};
import { environment } from '../environment/environments';
export const PROJECTS_API = `${environment.apiUrl}/proyecto`;

export const getProjects = async (token: string) => {
    const response = await fetch(PROJECTS_API, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al cargar proyectos');
    }

    return response.json();
};
