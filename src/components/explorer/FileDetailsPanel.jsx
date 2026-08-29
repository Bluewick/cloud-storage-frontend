import React, { useState, useEffect } from 'react';
import { filesApi } from '../../api/files.api';
import { getFileIcon } from '../../utils/fileIcons';
import { formatBytes, formatDateTime } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  X,
  Download,
  Share2,
  Star,
  Trash2,
  HardDrive,
  Calendar,
  FileCode,
  Loader2,
} from 'lucide-react';

export function FileDetailsPanel({
  fileId,
  isOpen,
  onClose,
  onShare,
  onDelete,
  onStarToggle,
}) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (fileId && isOpen) {
      setIsLoading(true);
      filesApi
        .getFileMetadata(fileId)
        .then((res) => setFile(res.data))
        .catch((err) => console.error('Failed to load file details:', err))
        .finally(() => setIsLoading(false));
    }
  }, [fileId, isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!file) return;
    try {
      const res = await filesApi.getDownloadUrl(file.id);
      if (res?.data?.downloadUrl) {
        window.open(res.data.downloadUrl, '_blank');
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-80 sm:w-96 bg-white border-l border-outline shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-outline flex items-center justify-between">
        <h3 className="text-sm font-semibold text-on-surface">File Information</h3>
        <Button variant="ghost" size="icon-sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : file ? (
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* File Preview Card */}
          <div className="flex flex-col items-center justify-center p-6 bg-surface-dim rounded-2xl border border-outline text-center">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-level-1 border border-outline flex items-center justify-center mb-3">
              {getFileIcon(file.extension, file.mimeType, 32)}
            </div>
            <h4 className="text-sm font-bold text-on-surface truncate w-full px-2">
              {file.name}
            </h4>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default" size="sm">
                .{file.extension?.toUpperCase() || 'FILE'}
              </Badge>
              {file.isStarred && (
                <Badge variant="warning" size="sm" dot dotColor="yellow">
                  Starred
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownload}
              leftIcon={<Download size={14} />}
            >
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare && onShare(file)}
              leftIcon={<Share2 size={14} />}
            >
              Share
            </Button>
          </div>

          {/* Metadata Rows */}
          <div className="space-y-4 text-xs">
            <h5 className="font-semibold uppercase tracking-wider text-on-surface-muted text-[11px]">
              Properties
            </h5>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-1 border-b border-surface-dim">
                <span className="text-on-surface-variant flex items-center gap-2">
                  <HardDrive size={14} className="text-on-surface-muted" />
                  File Size
                </span>
                <span className="font-semibold text-on-surface">
                  {formatBytes(file.sizeBytes)}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-surface-dim">
                <span className="text-on-surface-variant flex items-center gap-2">
                  <FileCode size={14} className="text-on-surface-muted" />
                  MIME Type
                </span>
                <span className="font-semibold text-on-surface truncate max-w-[150px]">
                  {file.mimeType}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-surface-dim">
                <span className="text-on-surface-variant flex items-center gap-2">
                  <Calendar size={14} className="text-on-surface-muted" />
                  Created
                </span>
                <span className="text-on-surface-variant">{formatDateTime(file.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-surface-dim">
                <span className="text-on-surface-variant flex items-center gap-2">
                  <Calendar size={14} className="text-on-surface-muted" />
                  Last Modified
                </span>
                <span className="text-on-surface-variant">{formatDateTime(file.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Destructive Actions */}
          <div className="pt-4 border-t border-outline">
            <Button
              variant="destructive-outline"
              size="sm"
              onClick={() => onDelete && onDelete(file)}
              leftIcon={<Trash2 size={14} />}
              className="w-full"
            >
              Move to Trash
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}