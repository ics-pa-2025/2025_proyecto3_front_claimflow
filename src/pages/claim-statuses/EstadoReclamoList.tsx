import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { getEstadosReclamo, deleteEstadoReclamo, updateEstadoReclamo } from '../../services/estadoReclamo.service';
import Cookies from 'js-cookie';
import { EstadoReclamo } from '../../types';

export const EstadoReclamoList = () => {
    const [estados, setEstados] = useState<EstadoReclamo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEstados();
    }, []);

    const fetchEstados = async () => {
        setIsLoading(true);
        try {
            const token = Cookies.get('access_token');
            if (!token) return;
            const data = await getEstadosReclamo(token);
            setEstados(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Protected status names that must not be deletable
    const protectedStatusNames = [
        'Recibido',
        'Asignado',
        'Clasificado',
        'En proceso',
        'Reasignado',
        'Resuelto',
        'En espera de confirmación',
        'Cerrado'
    ].map(n => n.toLowerCase());

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Está seguro de marcar como inactivo este estado?')) return;
        try {
            const token = Cookies.get('access_token');
            if (!token) return;
            // Instead of deleting, mark as inactive
            await updateEstadoReclamo(id, { activo: false }, token);
            fetchEstados(); // Reload list
        } catch (err: any) {
            alert('Error al marcar como inactivo: ' + err.message);
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Estados de Reclamo</h1>
                    <p className="text-secondary-500">Gestiona los posibles estados de los reclamos ({estados.length})</p>
                </div>
                <Link to="/claim-statuses/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Estado
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary-500" />
                        <Input className="pl-9" placeholder="Buscar..." />
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
                                    <th className="px-4 py-3">Color</th>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Descripción</th>
                                    <th className="px-4 py-3">Estado</th>
                                    <th className="px-4 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-200 bg-white">
                                {estados.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-secondary-500">
                                            No hay estados registrados
                                        </td>
                                    </tr>
                                ) : (
                                    estados.map((estado) => (
                                        <tr key={estado._id} className="hover:bg-secondary-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <div
                                                    className="w-6 h-6 rounded-full border border-secondary-200"
                                                    style={{ backgroundColor: estado.color }}
                                                    title={estado.color}
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-medium text-secondary-900">{estado.nombre}</td>
                                            <td className="px-4 py-3 text-secondary-700">{estado.descripcion}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${estado.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {estado.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link to={`/claim-statuses/${estado._id}/edit`}>
                                                        <Button variant="ghost" size="sm">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                                        </Button>
                                                    </Link>
                                                    { !protectedStatusNames.includes((estado.nombre || '').toLowerCase()) && (
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(estado._id)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 lucide lucide-trash-2"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                                        </Button>
                                                    )}
                                                </div>
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
