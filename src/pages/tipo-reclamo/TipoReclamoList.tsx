import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { getTiposReclamo, deleteTipoReclamo, TipoReclamo } from '../../services/tipoReclamo.service';
import Cookies from 'js-cookie';

export const TipoReclamoList = () => {
    const navigate = useNavigate();
    const [tipos, setTipos] = useState<TipoReclamo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTipos = async () => {
        try {
            const token = Cookies.get('access_token');
            if (!token) return;
            const data = await getTiposReclamo(token);
            setTipos(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTipos();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este tipo de reclamo?')) return;
        try {
            const token = Cookies.get('access_token');
            if (!token) return;
            await deleteTipoReclamo(id, token);
            setTipos(tipos.filter(t => t._id !== id));
        } catch (err: any) {
            alert('Error al eliminar tipo: ' + err.message);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-secondary-900">Tipos de Reclamo</h1>
                <Button onClick={() => navigate('/claim-types/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Tipo
                </Button>
            </div>

            {error && (
                <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Tipos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-secondary-50 text-secondary-700">
                                <tr>
                                    <th className="px-6 py-3">Nombre</th>
                                    <th className="px-6 py-3">Descripción</th>
                                    <th className="px-6 py-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tipos.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-secondary-500">
                                            No hay tipos de reclamo registrados
                                        </td>
                                    </tr>
                                ) : (
                                    tipos.map((tipo) => (
                                        <tr key={tipo._id} className="bg-white border-b hover:bg-secondary-50">
                                            <td className="px-6 py-4 font-medium text-secondary-900">
                                                {tipo.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-secondary-500">
                                                {tipo.descripcion || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/claim-types/${tipo._id}/edit`)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(tipo._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
