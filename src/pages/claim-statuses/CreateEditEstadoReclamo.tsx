import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { createEstadoReclamo, getEstadoReclamoById, updateEstadoReclamo } from '../../services/estadoReclamo.service';
import Cookies from 'js-cookie';

export const CreateEditEstadoReclamo = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        color: '#000000',
        activo: true
    });

    useEffect(() => {
        const loadData = async () => {
            if (isEditMode) {
                try {
                    const token = Cookies.get('access_token');
                    if (!token) return;
                    const data = await getEstadoReclamoById(id, token);
                    setFormData({
                        nombre: data.nombre,
                        descripcion: data.descripcion,
                        color: data.color,
                        activo: data.activo
                    });
                } catch (err: any) {
                    setError("Error al cargar datos: " + err.message);
                }
            }
            setIsFetching(false);
        };
        loadData();
    }, [id, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = Cookies.get('access_token');
            if (!token) throw new Error("No hay sesión activa");

            if (isEditMode) {
                await updateEstadoReclamo(id, formData, token);
            } else {
                await createEstadoReclamo(formData, token);
            }

            navigate('/claim-statuses');
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-secondary-900">
                    {isEditMode ? 'Editar Estado' : 'Nuevo Estado'}
                </h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Estado</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Nombre</label>
                                <Input
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Nombre del estado (ej: Pendiente)"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Color</label>
                                <div className="flex gap-2 items-center">
                                    <Input
                                        type="color"
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        className="w-12 h-10 p-1 cursor-pointer"
                                        required
                                    />
                                    <Input
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        placeholder="#000000"
                                        pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700">Descripción</label>
                            <textarea
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                className="flex min-h-[100px] w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                placeholder="Describe cuándo se aplica este estado..."
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="activo"
                                checked={formData.activo}
                                onChange={(e) => setFormData(prev => ({ ...prev, activo: e.target.checked }))}
                                id="activo"
                                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label htmlFor="activo" className="text-sm font-medium text-secondary-700">
                                Activo
                            </label>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/claim-statuses')}>
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {isEditMode ? 'Actualizar Estado' : 'Guardar Estado'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};
