import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-primary hover:bg-primary-hover text-white shadow-sm hover:shadow active:scale-[0.98] focus-visible:ring-primary/30',
  secondary:
    'bg-surface-dim hover:bg-surface-container-high text-on-surface hover:text-on-surface active:scale-[0.98] focus-visible:ring-slate-300',
  outline:
    'bg-white border border-outline hover:bg-surface-dim text-on-surface hover:text-on-surface shadow-sm focus-visible:ring-primary/20',
  ghost:
    'bg-transparent hover:bg-surface-dim text-on-surface-variant hover:text-on-surface',
  destructive:
    'bg-accent-error hover:bg-accent-error-on text-white shadow-sm active:scale-[0.98] focus-visible:ring-accent-error/30',
  'destructive-outline':
    'bg-white border border-accent-error/30 text-accent-error hover:bg-accent-error-container',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 font-medium rounded-md',
  md: 'h-9 px-4 text-sm gap-2 font-medium rounded-lg',
  lg: 'h-11 px-5 text-base gap-2.5 font-medium rounded-lg',
  icon: 'h-9 w-9 p-0 flex items-center justify-center rounded-lg',
  'icon-sm': 'h-7 w-7 p-0 flex items-center justify-center rounded-md',
};

export const Button = React.forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className = '',
    type = 'button',
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center cursor-pointer justify-center transition-all duration-150 select-none outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={size === 'sm' || size === 'icon-sm' ? 14 : 16} />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});