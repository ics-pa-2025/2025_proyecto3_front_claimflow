import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Cookies from 'js-cookie';
import { getRoles } from '../../services/roles.service';
import { createUser } from '../../services/users.service';
import { Role } from '../../types';

export const CreateUser = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        dni: '',
        phone: '',
        address: '',
        roleIds: [] as string[]
    });

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) return;
                const data = await getRoles(token);
                setRoles(data);
            } catch (err: any) {
                console.error('Error fetching roles:', err);
                // Continue without roles if fail
            } finally {
                setIsLoadingRoles(false);
            }
        };

        fetchRoles();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleRoleChange = (roleId: string) => {
        setFormData(prev => {
            const currentRoles = prev.roleIds;
            if (currentRoles.includes(roleId)) {
                return { ...prev, roleIds: currentRoles.filter(id => id !== roleId) };
            } else {
                return { ...prev, roleIds: [...currentRoles, roleId] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            const token = Cookies.get('access_token');
            if (!token) throw new Error("No hay sesión activa");

            await createUser(formData, token);
            navigate('/users');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/users')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Nuevo Usuario</h1>
                    <p className="text-secondary-500">Registra un nuevo usuario en el sistema</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datos del Usuario</CardTitle>
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
                                    id="fullname"
                                    label="Nombre Completo"
                                    placeholder="Ej: Juan Pérez"
                                    required
                                    value={formData.fullname}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="email"
                                    type="email"
                                    label="Email"
                                    placeholder="juan.perez@empresa.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="password"
                                    type="password"
                                    label="Contraseña"
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="dni"
                                    label="DNI"
                                    placeholder="Ej: 12345678"
                                    value={formData.dni}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="phone"
                                    label="Teléfono"
                                    placeholder="Ej: +54 9 11 ..."
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="address"
                                    label="Dirección"
                                    placeholder="Domicilio"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-secondary-700">Areas (Roles)</label>
                            <div className="flex flex-wrap gap-4 p-4 border border-secondary-200 rounded-md bg-white">
                                {isLoadingRoles ? (
                                    <div className="flex w-full justify-center py-2">
                                        <Loader2 className="h-5 w-5 animate-spin text-secondary-400" />
                                    </div>
                                ) : roles.length === 0 ? (
                                    <p className="text-sm text-secondary-500">No hay roles disponibles</p>
                                ) : (
                                    roles.map(role => (
                                        <div key={role.id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`role-${role.id}`}
                                                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                                                checked={formData.roleIds.includes(role.id)}
                                                onChange={() => handleRoleChange(role.id)}
                                            />
                                            <label
                                                htmlFor={`role-${role.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-secondary-700"
                                            >
                                                {role.name}
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => navigate('/users')}>
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
                                        Guardar Usuario
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
