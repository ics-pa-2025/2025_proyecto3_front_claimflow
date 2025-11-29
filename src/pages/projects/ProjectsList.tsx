import React from 'react';
import { Plus, Search, Folder, Calendar, MoreHorizontal } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { MOCK_CLIENTS } from '../../lib/mock-data';

export const ProjectsList = () => {
    // Flatten projects from clients for display
    const allProjects = MOCK_CLIENTS.flatMap(client =>
        client.projects.map(project => ({
            ...project,
            clientName: client.name
        }))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Proyectos</h1>
                    <p className="text-secondary-500">Supervisa todos los proyectos activos</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Proyecto
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary-500" />
                        <Input className="pl-9" placeholder="Buscar proyectos..." />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {allProjects.map((project) => (
                            <div key={project.id} className="group relative flex flex-col justify-between rounded-lg border border-secondary-200 bg-white p-5 hover:border-primary-200 hover:shadow-md transition-all">
                                <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="mb-4">
                                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                        <Folder className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-semibold text-secondary-900">{project.name}</h3>
                                    <p className="text-sm text-secondary-500">{project.clientName}</p>
                                </div>

                                <div className="flex items-center justify-between border-t border-secondary-100 pt-4">
                                    <span className="inline-flex items-center rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-medium text-secondary-800">
                                        {project.type}
                                    </span>
                                    <div className="flex items-center text-xs text-secondary-500">
                                        <Calendar className="mr-1 h-3 w-3" />
                                        Activo
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
