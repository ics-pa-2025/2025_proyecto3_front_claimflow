import React from 'react';
import { Plus, Search, Building2, Phone, Folder } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { MOCK_CLIENTS } from '../../lib/mock-data';

export const ClientsList = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Clientes</h1>
                    <p className="text-secondary-500">Gestiona la cartera de clientes y sus proyectos</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Cliente
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_CLIENTS.map((client) => (
                    <Card key={client.id} hoverEffect>
                        <CardHeader className="flex flex-row items-start justify-between pb-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-secondary-900">{client.name}</h3>
                                    <p className="text-sm text-secondary-500">{client.email}</p>
                                </div>
                            </div>
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
                                    <p className="mb-2 text-xs font-medium text-secondary-500 uppercase">Proyectos Activos</p>
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
                            <div className="mt-4 pt-4 border-t border-secondary-100 flex justify-end">
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
