import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { getAreas, deleteArea } from '../../services/areas.service';
import Cookies from 'js-cookie';

export const AreasList = () => {
    const navigate = useNavigate();
    const [areas, setAreas] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAreas = async () => {
        try {
            const token = Cookies.get('access_token');
            if (!token) return;
            const data = await getAreas(token);
            setAreas(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAreas();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este área?')) return;
        try {
            const token = Cookies.get('access_token');
            if (!token) return;
            await deleteArea(id, token);
            setAreas(areas.filter(a => a._id !== id));
        } catch (err: any) {
            alert('Error al eliminar área: ' + err.message);
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
                <h1 className="text-3xl font-bold text-secondary-900">Áreas</h1>
                <Button onClick={() => navigate('/areas/new')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Área
                </Button>
            </div>

            {error && (
                <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
                    {error}
                </div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Áreas</CardTitle>
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
                                {areas.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-secondary-500">
                                            No hay áreas registradas
                                        </td>
                                    </tr>
                                ) : (
                                    areas.map((area) => (
                                        <tr key={area._id} className="bg-white border-b hover:bg-secondary-50">
                                            <td className="px-6 py-4 font-medium text-secondary-900">
                                                {area.nombre}
                                            </td>
                                            <td className="px-6 py-4 text-secondary-500">
                                                {area.descripcion || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/areas/${area._id}/edit`)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(area._id)}
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
