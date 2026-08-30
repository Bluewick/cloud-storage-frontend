import React, { useState, useRef, useEffect } from 'react';

export function DropdownMenu({
  trigger,
  children,
  align = 'right', // 'left' | 'right'
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative cursor-pointer inline-block text-left" ref={containerRef}>
      {/* Trigger */}
      <div 
        onClick={() => setIsOpen((prev) => !prev)} 
        className="cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>

      {/* Dropdown Menu (Always in DOM, toggled via CSS) */}
      <div
        onClick={() => setIsOpen(false)}
        className={`absolute z-40 mt-1.5 w-52 bg-white rounded-xl border border-outline shadow-level-2 p-1.5 
          transition-all duration-150 ease-out
          ${align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'}
          ${
            isOpen
              ? 'opacity-100 scale-100 translate-y-0 visible pointer-events-auto'
              : 'opacity-0 scale-95 -translate-y-1.5 invisible pointer-events-none'
          }
          ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

export function DropdownItem({
  children,
  icon,
  onClick,
  variant = 'default',
  disabled = false,
  shortcut,
  className = '',
}) {
  const variantClasses =
    variant === 'destructive'
      ? 'text-accent-error hover:bg-accent-error-container hover:text-accent-error-on'
      : 'text-on-surface-variant hover:bg-surface-dim hover:text-on-surface';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex cursor-pointer items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg transition-colors text-left ${variantClasses} ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </div>
      {shortcut && <span className="text-[10px] text-on-surface-muted">{shortcut}</span>}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="h-px bg-outline my-1" />;
}