import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { createArea, getAreaById, updateArea } from '../../services/areas.service';
import Cookies from 'js-cookie';

export const CreateEditArea = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!id);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    useEffect(() => {
        const loadData = async () => {
            if (!isEditMode) return;
            try {
                const token = Cookies.get('access_token');
                if (!token) return;
                const area = await getAreaById(id, token);
                setFormData({
                    nombre: area.nombre,
                    descripcion: area.descripcion || ''
                });
            } catch (err: any) {
                setError("Error al cargar datos: " + err.message);
            } finally {
                setIsFetching(false);
            }
        };
        loadData();
    }, [id, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = Cookies.get('access_token');
            if (!token) throw new Error("No hay sesión activa");

            if (isEditMode) {
                await updateArea(id, formData, token);
            } else {
                await createArea(formData, token);
            }

            navigate('/areas');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-secondary-900">{isEditMode ? 'Editar Área' : 'Nueva Área'}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Área</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700">Nombre</label>
                            <Input
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Nombre del área"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700">Descripción</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className="flex min-h-[100px] w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                placeholder="Descripción opcional..."
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/areas')}>
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {isEditMode ? 'Actualizar' : 'Guardar'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};
