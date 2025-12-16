import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Cookies from 'js-cookie';
import { getClients } from '../../services/clients.service';
import { Client } from '../../types';

export const EditProject = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        clienteId: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) return;

                // Fetch Clients and Project in parallel
                const { environment } = await import('../../environment/environments');
                const [clientsData, projectResponse] = await Promise.all([
                    getClients(token),
                    fetch(`${environment.apiUrl}/proyecto/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                // Process Clients
                const mappedClients: Client[] = clientsData.map((item: any) => ({
                    id: item._id,
                    name: item.nombre,
                    lastName: item.apellido,
                    email: item.email,
                    dni: item.dni,
                    phone: item.telefono,
                    projects: item.proyectos || []
                }));
                setClients(mappedClients);

                // Process Project
                if (!projectResponse.ok) {
                    throw new Error('Error al cargar el proyecto');
                }
                const projectData = await projectResponse.json();

                // Handle clienteId which might be an object (populated) or string
                const clienteId = projectData.clienteId && typeof projectData.clienteId === 'object'
                    ? projectData.clienteId._id
                    : projectData.clienteId || '';

                setFormData({
                    nombre: projectData.nombre,
                    descripcion: projectData.descripcion,
                    clienteId: clienteId
                });

            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadData();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const token = Cookies.get('access_token');
            const { environment } = await import('../../environment/environments');
            const response = await fetch(`${environment.apiUrl}/proyecto/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el proyecto');
            }

            navigate('/projects');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Editar Proyecto</h1>
                    <p className="text-secondary-500">Modifica los datos del proyecto</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datos del Proyecto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-[var(--accent)] bg-[rgba(189,147,249,0.08)] rounded-md border border-[rgba(189,147,249,0.18)] dark:bg-[rgba(189,147,249,0.12)] dark:border-[rgba(189,147,249,0.28)] dark:text-[var(--accent)]">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Input
                                    id="nombre"
                                    label="Nombre del Proyecto"
                                    placeholder="Ej: Implementación CRM"
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="descripcion"
                                    label="Descripción"
                                    placeholder="Breve descripción del proyecto"
                                    required
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="clienteId" className="text-sm font-medium text-secondary-700">
                                    Cliente
                                </label>
                                <select
                                    id="clienteId"
                                    className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.clienteId}
                                    onChange={handleChange}
                                >
                                    <option value="">Seleccionar cliente...</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.name} {client.lastName} - {client.email}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => navigate('/projects')}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Guardar Cambios
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
