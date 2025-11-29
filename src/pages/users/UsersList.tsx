import React from 'react';
import { Plus, Search, MoreVertical, Mail, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { MOCK_USERS } from '../../lib/mock-data';

export const UsersList = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-secondary-900">Usuarios</h1>
                    <p className="text-secondary-500">Administra el acceso y roles del sistema</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Usuario
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary-500" />
                        <Input className="pl-9" placeholder="Buscar usuarios..." />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {MOCK_USERS.map((user) => (
                            <div key={user.id} className="flex items-center justify-between rounded-lg border border-secondary-200 p-4 hover:bg-secondary-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                                    <div>
                                        <h3 className="font-medium text-secondary-900">{user.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-secondary-500">
                                            <Mail className="h-3 w-3" />
                                            {user.email}
                                        </div>
                                        <div className="mt-1 flex items-center gap-1 text-xs font-medium text-primary-600">
                                            <Shield className="h-3 w-3" />
                                            {user.role}
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4 text-secondary-500" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
