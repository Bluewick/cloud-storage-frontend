import React from 'react';
import { FolderOpen } from 'lucide-react';

export function EmptyState({
  icon = <FolderOpen size={36} className="text-on-surface-muted" />,
  title = 'No items found',
  description = 'This folder is empty or no files match your criteria.',
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-outline rounded-2xl bg-surface/50 ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-surface-dim flex items-center justify-center mb-4 border border-outline">
        {icon}
      </div>
      <h4 className="text-base font-semibold text-on-surface mb-1">{title}</h4>
      <p className="text-xs text-on-surface-variant max-w-sm mb-5 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}