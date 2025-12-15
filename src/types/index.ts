// Tipos de reclamo disponibles en el sistema
export const CLAIM_TYPE_OPTIONS = [
    { value: 'Error de Software', label: 'Error de Software' },
    { value: 'Consulta', label: 'Consulta' },
    { value: 'Mejora', label: 'Mejora' },
    { value: 'Soporte Técnico', label: 'Soporte Técnico' },
    { value: 'Otro', label: 'Otro' },
];
export interface Role {
    id: string;
    name: string;
    description: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

export interface Client {
    id: string;
    name: string;
    lastName: string;
    email: string;
    dni: string;
    phone?: string;
    projects: Project[];
}

export interface Project {
    id: string;
    name: string;
    type: string;
    clientId: string;
}

export type ClaimPriority = 'Alta' | 'Media' | 'Baja';
export type ClaimCriticality = 'Alta' | 'Media' | 'Baja';
export interface EstadoReclamo {
    _id: string;
    nombre: string;
    descripcion: string;
    color: string;
    activo: boolean;
}

export type ClaimStatus = string | EstadoReclamo;
export type ClaimArea = 'Ventas' | 'Soporte' | 'Facturacion';

export interface Claim {
    id: string;
    title: string; // Derived from description or separate field? Assuming description for now.
    description: string;
    type: string;
    priority: ClaimPriority;
    criticality: ClaimCriticality;
    status: ClaimStatus;
    area: ClaimArea;
    clientId: string;
    projectId: string;
    assignedTo?: string; // User ID
    createdAt: string;
    updatedAt: string;
    files?: string[];
    history: ClaimHistory[];
    comments: Comment[];
}

export interface ClaimHistory {
    id: string;
    date: string;
    action: string;
    user: string; // User Name or ID
}

export interface Comment {
    id: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
}

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    read: boolean;
    createdAt: string;
}
