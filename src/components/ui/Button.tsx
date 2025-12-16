import React from 'react';
import { cn } from "../../lib/utils";
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
        const variants = {
            primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm dark:bg-primary-500 dark:hover:bg-primary-600 dark:active:bg-primary-700',
            secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700',
            outline: 'border border-secondary-300 bg-transparent hover:bg-secondary-50 text-secondary-700 dark:border-secondary-700 dark:text-secondary-200 dark:hover:bg-secondary-800 dark:active:bg-secondary-700',
            ghost: 'bg-transparent hover:bg-secondary-100 text-secondary-700 dark:text-secondary-200 dark:hover:bg-secondary-800 dark:active:bg-secondary-700',
            danger: 'bg-[var(--accent-700)] text-white hover:bg-[var(--accent)] shadow-sm dark:bg-[var(--accent-700)] dark:hover:bg-[var(--accent)]',
        };

        const sizes = {
            sm: 'h-8 px-3 text-xs',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-8 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
