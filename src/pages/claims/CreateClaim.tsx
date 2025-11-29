import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export const CreateClaim = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submit
        navigate('/claims');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-secondary-900">Nuevo Reclamo</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Reclamo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Título</label>
                                <Input placeholder="Resumen del problema" required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Tipo</label>
                                <select className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                                    <option>Error de Software</option>
                                    <option>Facturación</option>
                                    <option>Solicitud de Servicio</option>
                                    <option>Otro</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Prioridad</label>
                                <select className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                                    <option>Baja</option>
                                    <option>Media</option>
                                    <option>Alta</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-secondary-700">Criticidad</label>
                                <select className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none">
                                    <option>Baja</option>
                                    <option>Media</option>
                                    <option>Alta</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700">Descripción Detallada</label>
                            <textarea
                                className="flex min-h-[120px] w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                placeholder="Describe el problema en detalle..."
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/claims')}>
                                <X className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button type="submit">
                                <Save className="mr-2 h-4 w-4" />
                                Guardar Reclamo
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};
