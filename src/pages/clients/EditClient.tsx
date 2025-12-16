import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Cookies from 'js-cookie';

export const EditClient = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        dni: ''
    });

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const token = Cookies.get('access_token');
                const { environment } = await import('../../environment/environments');
                const response = await fetch(`${environment.apiUrl}/cliente/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar el cliente');
                }

                const data = await response.json();
                setFormData({
                    nombre: data.nombre,
                    apellido: data.apellido,
                    email: data.email,
                    telefono: data.telefono || '',
                    dni: data.dni
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchClient();
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
            const { environment } = await import('../../environment/environments');
            const response = await fetch(`${environment.apiUrl}/cliente/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el cliente');
            }

            navigate('/clients');
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
                <Button variant="ghost" size="sm" onClick={() => navigate('/clients')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Editar Cliente</h1>
                    <p className="text-secondary-500">Modifica los datos del cliente</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datos del Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-[var(--accent)] bg-[rgba(189,147,249,0.08)] rounded-md border border-[rgba(189,147,249,0.18)] dark:bg-[rgba(189,147,249,0.12)] dark:border-[rgba(189,147,249,0.28)] dark:text-[var(--accent)]">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Input
                                    id="nombre"
                                    label="Nombre"
                                    placeholder="Juan"
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="apellido"
                                    label="Apellido"
                                    placeholder="Pérez"
                                    required
                                    value={formData.apellido}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="dni"
                                    label="DNI"
                                    placeholder="12345678"
                                    required
                                    value={formData.dni}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="email"
                                    label="Email"
                                    type="email"
                                    placeholder="juan.perez@empresa.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="telefono"
                                    label="Teléfono"
                                    placeholder="+54 11 1234-5678"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => navigate('/clients')}>
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
