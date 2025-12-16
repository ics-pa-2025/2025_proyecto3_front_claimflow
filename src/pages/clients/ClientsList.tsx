import React, { useEffect, useState } from 'react';
import { Plus, Search, Building2, Phone, Folder, Loader2, Trash } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Client } from '../../types';
import { getClients, deleteClient, getClientProjects } from '../../services/clients.service';

export const ClientsList = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
            try {
                const token = Cookies.get('access_token');
                if (!token) return;
                await deleteClient(id, token);
                setClients(clients.filter(client => client.id !== id));
            } catch (err: any) {
                setError(err.message);
            }
        }
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) return;
                const data = await getClients(token);

                // Map backend data to Client interface and fetch projects
                const mappedClientsPromises = data.map(async (item: any) => {
                    let activeProjects = [];
                    try {
                        const proyectos = await getClientProjects(item._id, token);
                        activeProjects = proyectos.map((proyecto: any) => ({
                            id: proyecto._id,
                            name: proyecto.nombre,
                            type: proyecto.tipo?.nombre || proyecto.tipo,
                            clientId: item._id
                        }));
                    } catch (err) {
                        console.error(`Error fetching projects for client ${item._id}:`, err);
                    }

                    return {
                        id: item._id,
                        name: item.nombre,
                        lastName: item.apellido,
                        email: item.email,
                        dni: item.dni,
                        phone: item.telefono,
                        projects: activeProjects
                    };
                });

                const mappedClients = await Promise.all(mappedClientsPromises);
                setClients(mappedClients);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-500 bg-red-50 rounded-md">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            {/* Toast informativo solo si showToast es true */}
            {showToast && (
                <div className="fixed top-6 right-6 z-50">
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded shadow-md flex items-center gap-2 animate-fade-in">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                        <span>Para registrar nuevos clientes visita el panel de usuarios.</span>
                        <button onClick={() => setShowToast(false)} className="ml-2 text-blue-400 hover:text-blue-600 focus:outline-none">&times;</button>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Clientes</h1>
                    <p className="text-secondary-500">Gestiona la cartera de clientes y sus proyectos</p>
                </div>
                <Button onClick={() => setShowToast(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Cliente
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {clients.map((client) => (
                    <Card key={client.id} hoverEffect>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900">{client.name} {client.lastName}</h3>
                                    <p className="text-sm text-secondary-500">{client.email}</p>
                                    <p className="text-xs text-secondary-400">DNI: {client.dni}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(client.id)}
                                className="text-secondary-400 hover:text-red-600 hover:bg-red-50 -mr-2"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-4 space-y-3">
                                {client.phone && (
                                    <div className="flex items-center gap-2 text-sm text-secondary-600">
                                        <Phone className="h-4 w-4" />
                                        {client.phone}
                                    </div>
                                )}
                                <div className="border-t border-secondary-100 pt-3">
                                    <p className="mb-2 text-xs font-medium text-secondary-500 uppercase">Proyectos</p>
                                    <div className="space-y-1">
                                        {client.projects.map((project) => (
                                            <div key={project.id} className="flex items-center gap-2 text-sm text-secondary-700">
                                                <Folder className="h-3 w-3 text-secondary-400" />
                                                {project.name}
                                            </div>
                                        ))}
                                        {client.projects.length === 0 && (
                                            <p className="text-sm text-secondary-400 italic">Sin proyectos</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-secondary-100 flex justify-end gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                                    onClick={() => navigate(`/clients/edit/${client.id}`)}
                                >
                                    Editar
                                </Button>
                                <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                                    Ver Detalles
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
