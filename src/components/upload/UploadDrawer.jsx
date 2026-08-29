import React, { useState } from 'react';
import { useUpload } from '../../context/UploadContext';
import { UploadItem } from './UploadItem';
import { ChevronDown, ChevronUp, X, UploadCloud, Check } from 'lucide-react';

export function UploadDrawer() {
  const { uploads, isDrawerOpen, setIsDrawerOpen, cancelUpload, retryUpload, clearCompleted } = useUpload();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isDrawerOpen || uploads.length === 0) return null;

  const activeCount = uploads.filter((u) =>
    ['pending', 'getting-url', 'uploading', 'confirming'].includes(u.status)
  ).length;

  const completedCount = uploads.filter((u) => u.status === 'completed').length;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-white border border-outline rounded-2xl shadow-level-2 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="px-4 py-3 bg-surface-dim border-b border-outline flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <UploadCloud size={14} />
          </div>
          <span className="text-xs font-semibold text-on-surface">
            {activeCount > 0
              ? `Uploading ${activeCount} item${activeCount > 1 ? 's' : ''}`
              : `${completedCount} upload${completedCount > 1 ? 's' : ''} completed`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {completedCount > 0 && activeCount === 0 && (
            <button
              type="button"
              onClick={clearCompleted}
              className="text-[11px] font-medium text-primary hover:underline px-1.5 py-0.5"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMinimized((prev) => !prev)}
            className="p-1 text-on-surface-muted hover:text-on-surface rounded-md"
            aria-label="Toggle minimized"
          >
            {isMinimized ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(false)}
            className="p-1 text-on-surface-muted hover:text-on-surface rounded-md"
            aria-label="Close drawer"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Upload Tasks List */}
      {!isMinimized && (
        <div className="max-h-72 overflow-y-auto p-3 space-y-2 bg-surface/50">
          {uploads.map((upload) => (
            <UploadItem
              key={upload.id}
              upload={upload}
              onCancel={cancelUpload}
              onRetry={retryUpload}
            />
          ))}
        </div>
      )}
    </div>
  );
}