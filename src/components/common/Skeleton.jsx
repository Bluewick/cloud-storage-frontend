import React from 'react';

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-surface-container-high rounded-md ${className}`} />;
}

export function TableRowSkeleton({ columns = 4 }) {
  return (
    <div className="flex items-center space-x-4 py-3.5 px-4 border-b border-outline">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-48" />
      <div className="flex-1" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-8 rounded-full" />
    </div>
  );
}

export function GridCardSkeleton() {
  return (
    <div className="bg-white border border-outline rounded-xl p-4 flex flex-col justify-between h-40 shadow-level-1">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}