import { User, Client, Project, Claim } from '../types';

export const MOCK_USERS: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@claimflow.com', role: 'Admin', avatar: 'https://ui-avatars.com/api/?name=Admin+User' },
    { id: '2', name: 'Ventas User', email: 'ventas@claimflow.com', role: 'Ventas', avatar: 'https://ui-avatars.com/api/?name=Ventas+User' },
    { id: '3', name: 'Soporte User', email: 'soporte@claimflow.com', role: 'Soporte', avatar: 'https://ui-avatars.com/api/?name=Soporte+User' },
];

export const MOCK_CLIENTS: Client[] = [
    {
        id: 'c1',
        name: 'Acme Corp',
        email: 'contact@acme.com',
        projects: [
            { id: 'p1', name: 'Website Redesign', type: 'Web', clientId: 'c1' },
            { id: 'p2', name: 'Mobile App', type: 'Mobile', clientId: 'c1' },
        ]
    },
    {
        id: 'c2',
        name: 'Globex Inc',
        email: 'info@globex.com',
        projects: [
            { id: 'p3', name: 'ERP Integration', type: 'Backend', clientId: 'c2' },
        ]
    }
];

export const MOCK_CLAIMS: Claim[] = [
    {
        id: 'r1',
        title: 'Error en login',
        description: 'El usuario no puede ingresar con credenciales válidas',
        type: 'Bug',
        priority: 'Alta',
        criticality: 'Alta',
        status: 'Abierto',
        area: 'Soporte',
        clientId: 'c1',
        projectId: 'p1',
        assignedTo: '3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [],
        comments: []
    },
    {
        id: 'r2',
        title: 'Solicitud de cambio de color',
        description: 'Cambiar el color del botón de comprar a verde',
        type: 'Mejora',
        priority: 'Baja',
        criticality: 'Baja',
        status: 'En Proceso',
        area: 'Ventas',
        clientId: 'c1',
        projectId: 'p1',
        assignedTo: '2',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        history: [],
        comments: []
    }
];
