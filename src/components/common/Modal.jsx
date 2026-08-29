import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Level 3 Backdrop Blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Surface Card Container */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${modalSizes[size] || modalSizes.md} bg-white rounded-xl border border-outline shadow-2xl z-10 overflow-hidden animate-in zoom-in-95 duration-150`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-3">
            <div>
              {title && <h3 className="text-lg font-semibold text-on-surface">{title}</h3>}
              {description && (
                <p className="text-xs text-on-surface-variant mt-0.5">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                aria-label="Close modal"
                className="text-on-surface-muted hover:text-on-surface -mr-1"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 bg-surface-dim border-t border-outline">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}