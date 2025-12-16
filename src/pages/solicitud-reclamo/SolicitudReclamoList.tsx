import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Loader2 } from 'lucide-react'; 
import { environment } from '../../environment/environments';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export const SolicitudReclamoList = () => {
    const [solicitudes, setSolicitudes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) throw new Error('No hay sesión activa');
                const res = await fetch(`${environment.apiUrl}/solicitud-reclamo`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Error al cargar solicitudes');
                const data = await res.json();
                setSolicitudes(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSolicitudes();
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
                    <h1 className="text-3xl font-bold text-secondary-900">Solicitudes de Reclamo</h1>
                    <p className="text-secondary-500">Listado de solicitudes ({solicitudes.length})</p>
                </div>
                <Link to="/solicitud-reclamo/new">
                    <Button>
                        Nueva Solicitud
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Solicitudes</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 text-sm text-[var(--accent)] bg-[rgba(189,147,249,0.08)] rounded-md border border-[rgba(189,147,249,0.18)] dark:bg-[rgba(189,147,249,0.12)] dark:border-[rgba(189,147,249,0.28)] dark:text-[var(--accent)]">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md border border-secondary-200 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary-50 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">ID</th>
                                    <th className="px-4 py-3">Tipo</th>
                                    <th className="px-4 py-3">Área</th>
                                    <th className="px-4 py-3">Cliente</th>
                                    <th className="px-4 py-3">Proyecto</th>
                                    <th className="px-4 py-3">Descripción</th>
                                    <th className="px-4 py-3">Evidencia</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-200 bg-white">
                                {solicitudes.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-secondary-500">
                                            No hay solicitudes registradas
                                        </td>
                                    </tr>
                                ) : (
                                    solicitudes.map((sol) => (
                                        <tr key={sol._id} className="hover:bg-secondary-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-secondary-900">#{sol._id.slice(-6)}</td>
                                            <td className="px-4 py-3 text-secondary-700">{sol.tipo}</td>
                                            <td className="px-4 py-3 text-secondary-700">{sol.area?.nombre || '-'}</td>
                                            <td className="px-4 py-3 text-secondary-700">{sol.cliente?.name || '-'}</td>
                                            <td className="px-4 py-3 text-secondary-700">{sol.proyecto?.name || '-'}</td>
                                            <td className="px-4 py-3 text-secondary-700">{sol.descripcion}</td>
                                            <td className="px-4 py-3 text-secondary-700">{Array.isArray(sol.evidencia) && sol.evidencia.length > 0 ? sol.evidencia.length + ' archivo(s)' : '-'}</td>
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
