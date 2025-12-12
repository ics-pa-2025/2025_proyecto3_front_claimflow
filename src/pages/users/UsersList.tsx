import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Cookies from 'js-cookie';
import { getUsers } from '../../services/users.service';

interface User {
    id: string;
    fullname: string;
    email: string;
    phone: string;
    dni: string;
    isActive: boolean;
    roles: string[];
}

export const UsersList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = Cookies.get('access_token');
                if (!token) return;
                const data = await getUsers(token);
                setUsers(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-secondary-900">Usuarios</h1>
                <p className="text-secondary-500">Gestiona los usuarios del sistema</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md border border-secondary-200">
                        <table className="w-full text-sm">
                            <thead className="bg-secondary-50 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Nombre</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Teléfono</th>
                                    <th className="px-4 py-3">DNI</th>
                                    <th className="px-4 py-3">Área</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-200 bg-white">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-secondary-500">
                                            No hay usuarios registrados
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-secondary-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-secondary-900">
                                                {user.fullname}
                                            </td>
                                            <td className="px-4 py-3 text-secondary-700">{user.email}</td>
                                            <td className="px-4 py-3 text-secondary-700">{user.phone || '-'}</td>
                                            <td className="px-4 py-3 text-secondary-700">{user.dni || '-'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1 flex-wrap">
                                                    {user.roles && user.roles.map((role, index) => (
                                                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                                                            {role}
                                                        </span>
                                                    ))}
                                                    {(!user.roles || user.roles.length === 0) && '-'}
                                                </div>
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
