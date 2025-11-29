import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../lib/mock-data';

interface AuthContextType {
    user: User | null;
    login: (email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Check local storage or session
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email: string) => {
        // Mock login logic
        let foundUser = MOCK_USERS.find(u => u.email === email);

        if (!foundUser) {
            // Create a dynamic user for testing with any email
            foundUser = {
                id: Math.random().toString(36).substr(2, 9),
                name: email.split('@')[0],
                email: email,
                role: 'User', // Default role
                avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
            };
        }

        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
