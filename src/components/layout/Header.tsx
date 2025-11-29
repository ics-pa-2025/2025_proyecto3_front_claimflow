import React from 'react';
import { Bell, Search, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface HeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

export const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-secondary-200 bg-white/80 px-4 sm:px-6 backdrop-blur-sm transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="rounded-lg p-2 text-secondary-500 hover:bg-secondary-100 hover:text-secondary-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
                </button>
            </div>

            <div className="flex flex-1 items-center gap-4 ml-4">
                <div className="w-full max-w-md hidden sm:block">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-secondary-500" />
                        <input
                            type="text"
                            placeholder="Buscar reclamos, clientes..."
                            className="h-9 w-full rounded-md border border-secondary-200 bg-secondary-50 pl-9 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="relative rounded-full w-9 h-9 p-0">
                    <Bell className="h-5 w-5 text-secondary-600" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </Button>

                <div className="h-8 w-px bg-secondary-200 hidden sm:block" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-secondary-900">Admin User</p>
                        <p className="text-xs text-secondary-500">Administrador</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium ring-2 ring-white shadow-sm">
                        AU
                    </div>
                </div>
            </div>
        </header>
    );
};
