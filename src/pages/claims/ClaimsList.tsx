import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search, Eye } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { MOCK_CLAIMS } from '../../lib/mock-data';
import { cn } from '../../lib/utils';
import { Claim } from '../../types';

export const ClaimsList = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Reclamos</h1>
                    <p className="text-secondary-500">Gestiona y da seguimiento a los reclamos</p>
                </div>
                <Link to="/claims/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Reclamo
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary-500" />
                        <Input className="pl-9" placeholder="Buscar por título, ID..." />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filtros
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border border-secondary-200">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary-50 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Título</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Prioridad</th>
                                    <th className="px-4 py-3">Área</th>
                                    <th className="px-4 py-3">Asignado a</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-200 bg-white">
                                {MOCK_CLAIMS.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-secondary-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-secondary-900">#{claim.id}</td>
                                        <td className="px-4 py-3 text-secondary-700">{claim.title}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                claim.status === 'Abierto' && "bg-blue-100 text-blue-800",
                                                claim.status === 'En Proceso' && "bg-yellow-100 text-yellow-800",
                                                claim.status === 'Cerrado' && "bg-green-100 text-green-800",
                                            )}>
                                                {claim.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                claim.priority === 'Alta' && "bg-red-100 text-red-800",
                                                claim.priority === 'Media' && "bg-orange-100 text-orange-800",
                                                claim.priority === 'Baja' && "bg-gray-100 text-gray-800",
                                            )}>
                                                {claim.priority}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-secondary-700">{claim.area}</td>
                                        <td className="px-4 py-3 text-secondary-700">
                                            {claim.assignedTo ? 'Usuario ' + claim.assignedTo : 'Sin asignar'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link to={`/claims/${claim.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
