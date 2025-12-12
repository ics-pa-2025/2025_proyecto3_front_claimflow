import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search, Eye, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { cn } from '../../lib/utils';
import { getClaims } from '../../services/claims.service';
import Cookies from 'js-cookie';

export const ClaimsList = () => {
    const [claims, setClaims] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClaims = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) return;
                const data = await getClaims(token);
                setClaims(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClaims();
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
                    <h1 className="text-3xl font-bold text-secondary-900">Reclamos</h1>
                    <p className="text-secondary-500">Gestiona y da seguimiento a los reclamos ({claims.length})</p>
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
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md border border-secondary-200">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary-50 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Tipo / Proyecto</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3">Prioridad</th>
                                    <th className="px-4 py-3">Área</th>
                                    <th className="px-4 py-3">Cliente</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-200 bg-white">
                                {claims.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-secondary-500">
                                            No hay reclamos registrados
                                        </td>
                                    </tr>
                                ) : (
                                    claims.map((claim) => (
                                        <tr key={claim._id} className="hover:bg-secondary-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-secondary-900">#{claim._id.slice(-6)}</td>
                                            <td className="px-4 py-3 text-secondary-700">
                                                <div className="font-medium">{claim.tipo}</div>
                                                <div className="text-xs text-secondary-500">{claim.proyecto?.nombre || 'Sin proyecto'}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                    claim.estado === 'Pendiente' && "bg-blue-100 text-blue-800",
                                                    claim.estado === 'En Proceso' && "bg-yellow-100 text-yellow-800",
                                                    claim.estado === 'Cerrado' && "bg-green-100 text-green-800",
                                                    !['Pendiente', 'En Proceso', 'Cerrado'].includes(claim.estado) && "bg-gray-100 text-gray-800"
                                                )}>
                                                    {claim.estado}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={cn(
                                                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                    claim.prioridad === 'Alta' && "bg-red-100 text-red-800",
                                                    claim.prioridad === 'Media' && "bg-orange-100 text-orange-800",
                                                    claim.prioridad === 'Baja' && "bg-gray-100 text-gray-800",
                                                )}>
                                                    {claim.prioridad}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-secondary-700">{claim.area}</td>
                                            <td className="px-4 py-3 text-secondary-700">
                                                {claim.cliente ? `${claim.cliente.nombre} ${claim.cliente.apellido}` : 'Sin cliente'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link to={`/claims/${claim._id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
