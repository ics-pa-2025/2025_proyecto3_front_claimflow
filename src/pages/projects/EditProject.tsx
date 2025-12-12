import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Cookies from 'js-cookie';

export const EditProject = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: ''
    });

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const token = Cookies.get('access_token');
                const response = await fetch(`http://localhost:3000/proyecto/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar el proyecto');
                }

                const data = await response.json();
                setFormData({
                    nombre: data.nombre,
                    descripcion: data.descripcion
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const token = Cookies.get('access_token');
            const response = await fetch(`http://localhost:3000/proyecto/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el proyecto');
            }

            navigate('/projects');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
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
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Editar Proyecto</h1>
                    <p className="text-secondary-500">Modifica los datos del proyecto</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datos del Proyecto</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Input
                                    id="nombre"
                                    label="Nombre del Proyecto"
                                    placeholder="Ej: Implementación CRM"
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="descripcion"
                                    label="Descripción"
                                    placeholder="Breve descripción del proyecto"
                                    required
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => navigate('/projects')}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Guardar Cambios
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
