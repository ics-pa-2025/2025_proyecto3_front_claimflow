import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Moon, Sun, Globe, Bell } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeAppearance: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-secondary-500" />
                ) : (
                    <Sun className="h-5 w-5 text-secondary-500" />
                )}
                <div>
                    <p className="font-medium text-secondary-900">Modo Oscuro</p>
                    <p className="text-sm text-secondary-500">Ajustar el tema de la aplicación</p>
                </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
                {theme === 'dark' ? 'Desactivar' : 'Activar'}
            </Button>
        </div>
    );
};

export const Settings = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-secondary-900">Configuración</h1>

            <div className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Apariencia</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ThemeAppearance />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Notificaciones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-secondary-500" />
                                <div>
                                    <p className="font-medium text-secondary-900">Alertas por Email</p>
                                    <p className="text-sm text-secondary-500">Recibir correos sobre actualizaciones</p>
                                </div>
                            </div>
                            <div className="h-6 w-11 rounded-full bg-primary-600 relative cursor-pointer">
                                <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Idioma</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5 text-secondary-500" />
                                <div>
                                    <p className="font-medium text-secondary-900">Idioma del Sistema</p>
                                    <p className="text-sm text-secondary-500">Español (Latinoamérica)</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Cambiar</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
