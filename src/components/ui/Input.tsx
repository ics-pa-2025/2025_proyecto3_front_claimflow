import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-1.5 block text-sm font-medium text-secondary-700 dark:text-secondary-400">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex h-10 w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
                        'dark:bg-[var(--surface)] dark:border-secondary-700 dark:text-secondary-100 dark:placeholder:text-secondary-400',
                        error && 'border-[var(--accent-700)] focus:ring-[var(--accent)]',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-xs text-[var(--accent)]">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
