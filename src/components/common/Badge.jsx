import React from 'react';

const badgeVariants = {
  default: 'bg-surface-dim text-on-surface-variant border border-outline',
  primary: 'bg-primary-container text-primary border border-primary/20',
  success: 'bg-accent-success-container text-accent-success-on border border-accent-success/20',
  warning: 'bg-accent-warning-container text-accent-warning-on border border-accent-warning/20',
  error: 'bg-accent-error-container text-accent-error-on border border-accent-error/20',
  neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
};

const dotColors = {
  blue: 'bg-blue-500',
  green: 'bg-accent-success',
  yellow: 'bg-accent-warning',
  red: 'bg-accent-error',
  purple: 'bg-purple-500',
  slate: 'bg-slate-400',
};

export function Badge({
  children,
  variant = 'default',
  dot,
  dotColor = 'blue',
  className = '',
  size = 'md',
}) {
  const sizeClasses = size === 'sm' ? 'text-[11px] py-0.5 px-2 h-5' : 'text-xs py-1 px-2.5 h-[22px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full shrink-0 tracking-tight transition-colors ${badgeVariants[variant] || badgeVariants.default} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[dotColor] || dotColors.blue}`}
        />
      )}
      {children}
    </span>
  );
}