import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, FileText, Settings, LogOut, Building2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import logo from '../../assets/logo.png';

import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    isMobile: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isOpen, isMobile, onClose }: SidebarProps) => {
    const { logout } = useAuth();
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
        { icon: FileText, label: 'Reclamos', to: '/claims' },
        { icon: Users, label: 'Usuarios', to: '/users' },
        { icon: Building2, label: 'Clientes', to: '/clients' },
        { icon: Briefcase, label: 'Proyectos', to: '/projects' },
        { icon: Settings, label: 'Configuración', to: '/settings' },
    ];

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen border-r border-secondary-200 bg-white transition-all duration-300 ease-in-out shadow-lg",
                isOpen ? "w-64 translate-x-0" : isMobile ? "-translate-x-full w-64" : "w-20 translate-x-0"
            )}
        >
            <div className="flex h-full flex-col">
                <div className={cn(
                    "flex h-16 items-center border-b border-secondary-200 bg-gradient-to-r from-white to-secondary-50 transition-all duration-300",
                    isOpen ? "px-6" : "justify-center px-0"
                )}>
                    <div className="flex items-center gap-3 font-bold text-xl text-secondary-900 overflow-hidden whitespace-nowrap">
                        <img src={logo} alt="ClaimFlow Logo" className="h-8 w-8 object-contain shrink-0" />
                        <span className={cn(
                            "bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent transition-opacity duration-300",
                            isOpen ? "opacity-100" : "opacity-0 w-0"
                        )}>
                            ClaimFlow
                        </span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden">
                    <nav className="space-y-1 px-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={isMobile ? onClose : undefined}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-3 rounded-lg py-2.5 text-sm font-medium transition-all duration-200 group relative',
                                        isOpen ? "px-3" : "justify-center px-2",
                                        isActive
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900'
                                    )
                                }
                                title={!isOpen ? item.label : undefined}
                            >
                                <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200", !isOpen && "group-hover:scale-110")} />
                                <span className={cn(
                                    "whitespace-nowrap transition-all duration-300 origin-left",
                                    isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 hidden"
                                )}>
                                    {item.label}
                                </span>

                                {/* Tooltip for collapsed state */}
                                {!isOpen && !isMobile && (
                                    <div className="absolute left-full ml-2 hidden rounded-md bg-secondary-900 px-2 py-1 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:block group-hover:opacity-100 z-50 whitespace-nowrap">
                                        {item.label}
                                    </div>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="border-t border-secondary-200 p-4">
                    <button
                        onClick={logout}
                        className={cn(
                            "flex w-full items-center gap-3 rounded-lg py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors",
                            isOpen ? "px-3" : "justify-center px-2"
                        )}
                        title={!isOpen ? "Cerrar Sesión" : undefined}
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        <span className={cn(
                            "whitespace-nowrap transition-all duration-300",
                            isOpen ? "opacity-100" : "opacity-0 w-0 hidden"
                        )}>
                            Cerrar Sesión
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
};
