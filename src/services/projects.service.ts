export const PROJECTS_API = 'http://localhost:3000/proyecto';

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
