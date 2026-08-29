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
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute z-40 mt-1.5 w-52 bg-white rounded-xl border border-outline shadow-level-2 p-1.5 animate-in fade-in zoom-in-95 duration-100 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  icon,
  onClick,
  variant = 'default', // 'default' | 'destructive'
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
      className={`w-full flex items-center justify-between px-2.5 py-2 text-xs font-medium rounded-lg transition-colors text-left ${variantClasses} ${
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