import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { User, Role } from '../types';
import { environment } from '../environment/environments';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get('access_token');
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                // Llama a /user/me para obtener el usuario y sus roles
                const res = await fetch(`${environment.authUrl}/user/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('No autenticado');
                const apiUser = await res.json();
                // Toma el primer rol como principal (puedes ajustar si hay lógica de múltiples roles)
                const mainRole: Role = apiUser.roles && apiUser.roles.length > 0 ? apiUser.roles[0] : { id: '', name: 'user', description: '' };
                const mappedUser: User = {
                    id: apiUser.id,
                    name: apiUser.fullname,
                    email: apiUser.email,
                    role: mainRole,
                    avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(apiUser.fullname) + '&background=random',
                };
                setUser(mappedUser);
                localStorage.setItem('user', JSON.stringify(mappedUser));
            } catch (err) {
                setUser(null);
                localStorage.removeItem('user');
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${environment.authUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al iniciar sesión');
            }

            const data = await response.json();
            const { accessToken } = data;
            Cookies.set('access_token', accessToken, { expires: 1 }); // 1 day

            // Ahora obtenemos el usuario real con roles
            const res = await fetch(`${environment.authUrl}/user/me`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (!res.ok) throw new Error('No autenticado');
            const apiUser = await res.json();
            const mainRole: Role = apiUser.roles && apiUser.roles.length > 0 ? apiUser.roles[0] : { id: '', name: 'user', description: '' };
            const mappedUser: User = {
                id: apiUser.id,
                name: apiUser.fullname,
                email: apiUser.email,
                role: mainRole,
                avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(apiUser.fullname) + '&background=random',
            };
            setUser(mappedUser);
            localStorage.setItem('user', JSON.stringify(mappedUser));
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            const token = Cookies.get('access_token');
            if (token) {
                await fetch(`${environment.authUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            Cookies.remove('access_token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
