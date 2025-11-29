import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.png';

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const cardRef = useRef<HTMLDivElement>(null);
    const [email, setEmail] = React.useState('');

    useEffect(() => {
        anime({
            targets: cardRef.current,
            translateY: [20, 0],
            opacity: [0, 1],
            easing: 'easeOutExpo',
            duration: 800,
            delay: 200,
        });
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(email);
        navigate('/');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary-50 via-primary-50 to-secondary-100 p-4">
            <div className="w-full max-w-md" ref={cardRef}>
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white p-4 shadow-lg shadow-primary-500/20">
                        <img src={logo} alt="ClaimFlow Logo" className="h-full w-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-bold text-secondary-900">ClaimFlow</h1>
                    <p className="mt-2 text-secondary-500">Sistema de Gestión de Reclamos</p>
                </div>

                <Card className="border-secondary-200 shadow-xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
                        <p className="text-center text-sm text-secondary-500">
                            Ingresa tus credenciales para acceder
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    id="email"
                                    label="Email"
                                    type="email"
                                    placeholder="nombre@empresa.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    id="password"
                                    label="Contraseña"
                                    type="password"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" size="lg">
                                Ingresar
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-6 text-center text-sm text-secondary-500">
                    ¿Olvidaste tu contraseña? <a href="#" className="font-medium text-primary-600 hover:underline">Contactar soporte</a>
                </p>
            </div>
        </div>
    );
};
