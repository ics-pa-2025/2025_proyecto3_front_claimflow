import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '../../lib/utils';

export const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
    <div className="min-h-screen bg-secondary-50 flex dark:bg-[var(--bg)]">
            {/* Overlay for mobile */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} onClose={() => setIsSidebarOpen(false)} />

            <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                !isMobile && (isSidebarOpen ? "ml-64" : "ml-20")
            )}>
                <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <main className="flex-1 p-6 overflow-x-hidden">
                    <div className="mx-auto max-w-7xl animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
