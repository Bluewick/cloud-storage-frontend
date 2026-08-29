import React from 'react';

export const Input = React.forwardRef(function Input(
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    shortcutKey,
    className = '',
    id,
    disabled,
    ...props
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-on-surface-muted">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full h-9 bg-white border text-sm text-on-surface placeholder:text-on-surface-muted rounded-lg transition-all outline-none
            ${leftIcon ? 'pl-9' : 'pl-3'}
            ${rightIcon || shortcutKey ? 'pr-12' : 'pr-3'}
            ${
              error
                ? 'border-accent-error focus:border-accent-error focus:ring-2 focus:ring-accent-error/20'
                : 'border-outline hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/15'
            }
            ${disabled ? 'bg-surface-dim text-on-surface-muted cursor-not-allowed' : ''}
            ${className}`}
          {...props}
        />

        {shortcutKey && !rightIcon && (
          <div className="absolute right-2.5 flex items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-on-surface-muted bg-surface-dim border border-outline rounded">
              {shortcutKey}
            </kbd>
          </div>
        )}

        {rightIcon && (
          <div className="absolute right-3 flex items-center text-on-surface-muted">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-accent-error font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-on-surface-muted">{helperText}</p>
      ) : null}
    </div>
  );
});