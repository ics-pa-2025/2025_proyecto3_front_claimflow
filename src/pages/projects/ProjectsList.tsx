import React, { useState, useEffect } from 'react';
import { Plus, Search, Folder, Calendar, MoreHorizontal, Loader2, Filter } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface Project {
    _id: string;
    nombre: string;
    descripcion: string;
    tipo?: { nombre: string };
    estado?: { nombre: string };
    clienteId?: { nombre: string; apellido: string };
}
import { useAuth } from '../../context/AuthContext';

export const ProjectsList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = Cookies.get('access_token');
                const { environment } = await import('../../environment/environments');
                const response = await fetch(`${environment.apiUrl}/proyecto`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar proyectos');
                }

                const data = await response.json();
                setProjects(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Proyectos</h1>
                    <p className="text-secondary-500">Supervisa todos los proyectos activos</p>
                </div>
                {user?.role?.name !== 'client' && (
                    <Button onClick={() => navigate('/projects/new')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Proyecto
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader className="border-b border-secondary-200 bg-secondary-50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
                            <Input
                                placeholder="Buscar proyectos..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4" />
                                Filtros
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}
                    {/* Project Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
                        {projects.map((project) => (
                            <div key={project._id} className="group relative flex flex-col justify-between rounded-lg border border-secondary-200 bg-white p-5 hover:border-primary-200 hover:shadow-md transition-all">
                                {user?.role?.name !== 'client' && (
                                    <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => navigate(`/projects/edit/${project._id}`)}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <Folder className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-secondary-900">{project.nombre}</h3>
                                    <p className="text-sm text-secondary-500">
                                        {project.clienteId ? `${project.clienteId.nombre} ${project.clienteId.apellido}` : 'Sin Cliente'}
                                    </p>
                                    <p className="mt-2 text-sm text-secondary-500 line-clamp-2">{project.descripcion}</p>
                                </div>

                                <div className="flex items-center justify-between border-t border-secondary-100 pt-4">
                                    <span className="inline-flex items-center rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-medium text-secondary-800">
                                        {project.tipo?.nombre || 'General'}
                                    </span>
                                    <div className="flex items-center text-xs text-secondary-500">
                                        <Calendar className="mr-1 h-3 w-3" />
                                        {project.estado?.nombre || 'Activo'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
