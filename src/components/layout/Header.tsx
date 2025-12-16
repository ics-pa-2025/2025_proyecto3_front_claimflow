import React from 'react';
import { Bell, Search, Menu, PanelLeftClose, PanelLeftOpen, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

export const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
    const { user } = useAuth();
    
    // Get user initials
    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Get role display name
    const getRoleDisplay = (roleName: string) => {
        const roleMap: Record<string, string> = {
            'admin': 'Administrador',
            'user': 'Usuario',
            'client': 'Cliente'
        };
        return roleMap[roleName] || roleName;
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-secondary-200 bg-white/80 px-4 sm:px-6 backdrop-blur-sm transition-all duration-300 dark:bg-[#060a12]/90 dark:border-secondary-800">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="rounded-lg p-2 text-secondary-500 hover:bg-secondary-100 hover:text-secondary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-secondary-400 dark:hover:bg-[rgba(189,147,249,0.06)] dark:hover:text-white"
                >
                    {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
                </button>
            </div>

            <div className="flex flex-1 items-center gap-4 ml-4">
                <div className="w-full max-w-md hidden sm:block">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary-500 dark:text-secondary-400" />
                        <input
                            type="text"
                            placeholder="Buscar reclamos, clientes..."
                            className="h-9 w-full rounded-md border border-secondary-200 bg-secondary-50 pl-9 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all dark:bg-[#071029] dark:border-secondary-700 dark:placeholder:text-secondary-400 dark:text-secondary-100"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {user?.role?.name !== 'client' && (
                    <Link to="/chat">
                        <Button variant="ghost" size="sm" className="relative rounded-full w-9 h-9 p-0">
                            <MessageCircle className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
                        </Button>
                    </Link>
                )}

                <Button variant="ghost" size="sm" className="relative rounded-full w-9 h-9 p-0">
                    <Bell className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-transparent" />
                </Button>

                <div className="h-8 w-px bg-secondary-200 hidden sm:block dark:bg-secondary-800" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{user?.name || 'Usuario'}</p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">{user?.role ? getRoleDisplay(user.role.name) : 'Sin rol'}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium ring-2 ring-white shadow-sm dark:bg-primary-800 dark:text-primary-200 dark:ring-transparent">
                        {user?.name ? getInitials(user.name) : 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
};
