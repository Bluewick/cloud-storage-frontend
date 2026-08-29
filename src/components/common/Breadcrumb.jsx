import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Breadcrumb({ items = [], rootLabel = 'My Drive', onNavigate }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1 text-sm">
      <Link
        to="/drive"
        onClick={() => onNavigate && onNavigate(null)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-dim transition-colors font-medium text-xs"
      >
        <Home size={14} className="text-on-surface-muted" />
        <span>{rootLabel}</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.id || index}>
            <ChevronRight size={14} className="text-on-surface-muted shrink-0" />
            {isLast ? (
              <span className="px-2 py-1 text-xs font-semibold text-on-surface truncate max-w-[200px]">
                {item.name}
              </span>
            ) : (
              <Link
                to={`/drive/${item.id}`}
                onClick={() => onNavigate && onNavigate(item.id)}
                className="px-2 py-1 rounded-md text-xs font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-dim transition-colors truncate max-w-[150px]"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}