import React from 'react';

export function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  color = 'auto', // 'auto' | 'primary' | 'success' | 'warning' | 'error'
  showLabel = false,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  // Determine dynamic color if set to 'auto'
  let barColorClass = 'bg-primary';
  if (color === 'auto') {
    if (percentage > 90) barColorClass = 'bg-accent-error';
    else if (percentage > 75) barColorClass = 'bg-accent-warning';
    else barColorClass = 'bg-primary';
  } else if (color === 'success') {
    barColorClass = 'bg-accent-success';
  } else if (color === 'warning') {
    barColorClass = 'bg-accent-warning';
  } else if (color === 'error') {
    barColorClass = 'bg-accent-error';
  }

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-on-surface-variant font-medium">
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={`w-full bg-surface-container-high rounded-full overflow-hidden ${heightClasses[size] || heightClasses.md}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${barColorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}