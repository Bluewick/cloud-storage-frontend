import React from 'react';
import { getFileIcon } from '../../utils/fileIcons';
import { formatBytes } from '../../utils/formatters';
import { ProgressBar } from '../common/ProgressBar';
import { CheckCircle2, XCircle, RefreshCw, X, Loader2 } from 'lucide-react';

export function UploadItem({ upload, onCancel, onRetry }) {
  const { id, name, size, progress, status, error } = upload;
  const ext = name.split('.').pop() || '';

  const isUploading = ['pending', 'getting-url', 'uploading', 'confirming'].includes(status);
  const isSuccess = status === 'completed';
  const isFailed = status === 'error' || status === 'canceled';

  return (
    <div className="p-3 bg-white border border-outline rounded-xl flex flex-col gap-2 shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 truncate flex-1">
          <div className="p-1.5 bg-surface-dim rounded-lg shrink-0">
            {getFileIcon(ext, '', 16)}
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-on-surface truncate">{name}</p>
            <p className="text-[11px] text-on-surface-muted">{formatBytes(size)}</p>
          </div>
        </div>

        {/* Action / Status Icon */}
        <div className="flex items-center gap-1 shrink-0">
          {isUploading && (
            <button
              type="button"
              onClick={() => onCancel(id)}
              className="p-1 text-on-surface-muted hover:text-accent-error hover:bg-surface-dim rounded"
              title="Cancel Upload"
            >
              <X size={14} />
            </button>
          )}

          {isFailed && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onRetry(id)}
                className="p-1 text-on-surface-muted hover:text-primary hover:bg-surface-dim rounded"
                title="Retry Upload"
              >
                <RefreshCw size={13} />
              </button>
              <XCircle size={15} className="text-accent-error" />
            </div>
          )}

          {isSuccess && <CheckCircle2 size={16} className="text-accent-success" />}
        </div>
      </div>

      {/* Progress Bar & Status Text */}
      {isUploading && (
        <div className="space-y-1">
          <ProgressBar value={progress} max={100} size="sm" color="primary" />
          <div className="flex justify-between items-center text-[10px] text-on-surface-muted font-medium">
            <span className="flex items-center gap-1">
              <Loader2 size={10} className="animate-spin text-primary" />
              {status === 'getting-url' && 'Preparing upload...'}
              {status === 'uploading' && `Uploading (${progress}%)...`}
              {status === 'confirming' && 'Saving metadata...'}
              {status === 'pending' && 'Pending...'}
            </span>
            <span>{progress}%</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {isFailed && error && (
        <p className="text-[11px] text-accent-error font-medium truncate">{error}</p>
      )}
    </div>
  );
}