import { environment } from '../environment/environments';
import { Archivo } from '../types/archivo.types';

const ARCHIVO_API = `${environment.apiUrl}/archivo`;

export const uploadFile = async (reclamoId: string, file: File, token?: string): Promise<Archivo> => {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${ARCHIVO_API}/upload/${reclamoId}`, {
        method: 'POST',
        headers,
        body: formData
    });

    if (!response.ok) {
        let message = 'Error al subir el archivo';
        try {
            const errorData = await response.json();
            message = errorData.message || message;
        } catch (e) { }
        throw new Error(message);
    }

    return response.json();
};

export const getFilesByReclamo = async (reclamoId: string, token?: string): Promise<Archivo[]> => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${ARCHIVO_API}/reclamo/${reclamoId}`, {
        headers
    });

    if (!response.ok) {
        throw new Error('Error al cargar los archivos');
    }

    return response.json();
};

export const deleteFile = async (archivoId: string, token?: string): Promise<void> => {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${ARCHIVO_API}/${archivoId}`, {
        method: 'DELETE',
        headers
    });

    if (!response.ok) {
        throw new Error('Error al eliminar el archivo');
    }
};

export const getDownloadUrl = (archivoId: string): string => {
    return `${ARCHIVO_API}/download/${archivoId}`;
};
