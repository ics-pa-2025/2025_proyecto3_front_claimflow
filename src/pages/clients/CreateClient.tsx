import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Cookies from 'js-cookie';

export const CreateClient = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        dni: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = Cookies.get('access_token');
            const response = await fetch('http://localhost:3000/cliente', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear el cliente');
            }

            navigate('/clients');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/clients')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Nuevo Cliente</h1>
                    <p className="text-secondary-500">Registra un nuevo cliente en el sistema</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datos del Cliente</CardTitle>
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
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Guardar Cliente
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
