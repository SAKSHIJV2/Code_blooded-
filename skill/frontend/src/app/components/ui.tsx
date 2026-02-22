import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary-blue text-white hover:opacity-90',
    outline: 'border border-primary-blue text-primary-blue hover:bg-primary-blue/5',
    ghost: 'hover:bg-primary-blue/5 text-slate-600',
    gradient: 'bg-gradient-to-r from-primary-blue to-accent-cyan text-white hover:opacity-90 shadow-lg shadow-primary-blue/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-8 py-3.5 text-lg font-medium',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'ready' | 'almost' | 'developing' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    ready: 'bg-success-emerald/10 text-success-emerald border-success-emerald/20',
    almost: 'bg-warning-amber/10 text-warning-amber border-warning-amber/20',
    developing: 'bg-error-red/10 text-error-red border-error-red/20',
    success: 'bg-success-emerald/10 text-success-emerald border-success-emerald/20',
    warning: 'bg-warning-amber/10 text-warning-amber border-warning-amber/20',
    error: 'bg-error-red/10 text-error-red border-error-red/20',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
