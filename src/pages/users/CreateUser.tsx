import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isEmail, isDniValid, minLength, isNotEmpty, isAlpha, isNumeric } from '../../lib/validators';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Cookies from 'js-cookie';
import { getRoles } from '../../services/roles.service';
import { createUser } from '../../services/users.service';
import { getClients, updateClient } from '../../services/clients.service';

// Nueva función para crear cliente
import { environment } from '../../environment/environments';
const createClient = async (clientData: any, token: string) => {
    const response = await fetch(`${environment.apiUrl}/cliente`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clientData)
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el cliente');
    }
    return response.json();
};
import { Role } from '../../types';

export const CreateUser = () => {
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingRoles, setIsLoadingRoles] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        dni: '',
        phone: '',
        address: '',
        roleIds: [] as string[]
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) return;

                const [rolesData, clientsData] = await Promise.all([
                    getRoles(token),
                    getClients(token)
                ]);

                setRoles(rolesData);
                setClients(clientsData);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                // Continue without roles/clients if fail
            } finally {
                setIsLoadingRoles(false);
            }
        };

        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        let sanitized = value;

        // Real-time sanitization per field
        if (id === 'nombre' || id === 'apellido') {
            sanitized = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
        } else if (id === 'dni') {
            sanitized = value.replace(/\D/g, '');
            if (sanitized.length > 10) sanitized = sanitized.slice(0, 10);
        }

        setFormData(prev => ({ ...prev, [id]: sanitized }));

        // live simple validation messages
        setFieldErrors(prev => ({ ...prev, [id]: '' }));
        if (id === 'email') {
            if (sanitized && !isEmail(sanitized)) setFieldErrors(prev => ({ ...prev, email: 'Email inválido' }));
        }
        if (id === 'password') {
            if (sanitized && !minLength(sanitized, 6)) setFieldErrors(prev => ({ ...prev, password: 'Mínimo 6 caracteres' }));
        }
    };

    const handleRoleChange = (roleId: string) => {
        const role = roles.find(r => r.id === roleId);
        // Assuming role name for client is 'client' or contains 'client' (case insensitive)
        const isClientRole = role?.name.toLowerCase().includes('client') || role?.name.toLowerCase().includes('cliente');

        setFormData(prev => {
            const currentRoles = prev.roleIds;
            let newRoles;
            if (currentRoles.includes(roleId)) {
                newRoles = currentRoles.filter(id => id !== roleId);
                // If removing client role, clear selection? Maybe optional depending on UX
                // keeping it simple: if removing client role, the UI for client selection will hide
            } else {
                newRoles = [...currentRoles, roleId];
            }
            return { ...prev, roleIds: newRoles };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        // Final minimal checks before submit
        const missing = !formData.nombre || !formData.apellido || !formData.email || !formData.password;
        const hasFieldErrors = Object.values(fieldErrors).some(Boolean);
        if (missing) {
            setError('Complete los campos requeridos');
            setIsSaving(false);
            return;
        }
        if (hasFieldErrors) {
            setError('Corrige los errores en el formulario');
            setIsSaving(false);
            return;
        }

        try {
            const token = Cookies.get('access_token');
            if (!token) throw new Error("No hay sesión activa");

            // ¿El rol seleccionado es client?
            const clientRoleId = roles.find(r => r.name.toLowerCase() === 'client' || r.name.toLowerCase() === 'cliente')?.id;
            const isClientSelected = formData.roleIds.includes(clientRoleId || '');

            let createdClientId = '';

            if (isClientSelected) {
                // Validar campos de cliente (usamos los del usuario)
                if (!formData.nombre || !formData.apellido || !formData.dni || !formData.email) {
                    throw new Error('Complete todos los datos requeridos');
                }
                // Crear cliente
                const clientPayload = {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    dni: formData.dni,
                    email: formData.email,
                    telefono: formData.phone
                };
                const createdClient = await createClient(clientPayload, token);
                createdClientId = createdClient._id || createdClient.id;
            }

            // Crear usuario
            const userPayload: any = {
                fullname: formData.nombre + ' ' + formData.apellido,
                email: formData.email,
                password: formData.password,
                dni: formData.dni,
                phone: formData.phone,
                address: formData.address,
                roleIds: formData.roleIds
            };
            // Si es client, asociar el id del cliente
            if (isClientSelected && createdClientId) {
                userPayload.clientId = createdClientId;
            }

            const newUser = await createUser(userPayload, token);

            // Si es client, asociar usuario al cliente (opcional, si backend lo requiere)
            if (isClientSelected && createdClientId) {
                try {
                    await updateClient(createdClientId, { usuarioId: newUser.id }, token);
                } catch (clientErr) {
                    console.error('Error linking client:', clientErr);
                    alert('Usuario y cliente creados, pero hubo un error al asociarlos.');
                }
            }

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
                            <div className="p-3 text-sm text-[var(--accent)] bg-[rgba(189,147,249,0.08)] rounded-md border border-[rgba(189,147,249,0.18)] dark:bg-[rgba(189,147,249,0.12)] dark:border-[rgba(189,147,249,0.28)] dark:text-[var(--accent)]">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Input
                                    id="nombre"
                                    label="Nombre"
                                    placeholder="Ej: Juan"
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    inputMode="text"
                                    pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                                />
                                {fieldErrors.nombre && <p className="text-xs text-red-500">{fieldErrors.nombre}</p>}
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="apellido"
                                    label="Apellido"
                                    placeholder="Ej: Pérez"
                                    required
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    inputMode="text"
                                    pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
                                />
                                {fieldErrors.apellido && <p className="text-xs text-red-500">{fieldErrors.apellido}</p>}
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
                                    inputMode="email"
                                />
                                {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="password"
                                    type="password"
                                    label="Contraseña"
                                    placeholder="Mínimo 6 caracteres"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength={6}
                                />
                                {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="dni"
                                    label="DNI"
                                    placeholder="Ej: 12345678"
                                    value={formData.dni}
                                    onChange={handleChange}
                                    inputMode="numeric"
                                    pattern="\d*"
                                    maxLength={10}
                                />
                                {fieldErrors.dni && <p className="text-xs text-red-500">{fieldErrors.dni}</p>}
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
                                                title={role.description}
                                            >
                                                {role.name}
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Client Selection for Client Role (solo si NO es creación automática) */}
                        {(() => {
                            const clientRoleId = roles.find(r => r.name.toLowerCase() === 'client' || r.name.toLowerCase() === 'cliente')?.id;
                            const isClientSelected = formData.roleIds.includes(clientRoleId || '');
                            if (isClientSelected) return null;
                            return (
                                formData.roleIds.some(id => {
                                    const r = roles.find(role => role.id === id);
                                    return r?.name.toLowerCase().includes('client') || r?.name.toLowerCase().includes('cliente');
                                }) && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-secondary-700">Asociar Cliente Existente</label>
                                        <select
                                            value={selectedClientId}
                                            onChange={(e) => setSelectedClientId(e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                                        >
                                            <option value="">Seleccionar Cliente</option>
                                            {clients.map(client => (
                                                <option key={client._id} value={client._id}>
                                                    {client.nombre} {client.apellido} - {client.dni}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-secondary-500">
                                            Si selecciona un cliente, este usuario quedará vinculado a él.
                                        </p>
                                    </div>
                                )
                            );
                        })()}

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
