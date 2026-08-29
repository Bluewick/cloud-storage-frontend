import React, { useState, useEffect } from 'react';
import { useTrash } from '../hooks/useTrash';
import { useAuth } from '../context/AuthContext';
import { getFileIcon, getFolderIcon } from '../utils/fileIcons';
import { formatBytes, formatDate } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { TableRowSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Clock,
  Trash,
} from 'lucide-react';

export function TrashPage() {
  const { trashData, isLoading, loadTrash, restoreItem, purgeItem, emptyTrash } = useTrash();
  const { refreshStorage } = useAuth();
  const [isEmptyModalOpen, setIsEmptyModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadTrash();
  }, [loadTrash]);

  const handleRestore = async (type, id) => {
    try {
      await restoreItem(type, id);
      refreshStorage();
    } catch (err) {
      console.error('Restore failed:', err);
    }
  };

  const handlePurge = async (type, id) => {
    try {
      await purgeItem(type, id);
      refreshStorage();
    } catch (err) {
      console.error('Purge failed:', err);
    }
  };

  const handleEmptyTrash = async () => {
    setIsProcessing(true);
    try {
      await emptyTrash();
      refreshStorage();
      setIsEmptyModalOpen(false);
    } catch (err) {
      console.error('Empty trash failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasItems = trashData.folders.length > 0 || trashData.files.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <Trash2 size={22} className="text-accent-error" />
            Trash
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Items in trash are automatically permanently purged after 30 days.
          </p>
        </div>

        {hasItems && (
          <Button
            variant="destructive-outline"
            size="sm"
            onClick={() => setIsEmptyModalOpen(true)}
            leftIcon={<Trash size={14} />}
          >
            Empty Trash
          </Button>
        )}
      </div>

      {/* Skeletons */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-outline">
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !hasItems && (
        <EmptyState
          icon={<Trash2 size={36} className="text-on-surface-muted" />}
          title="Trash is empty"
          description="Deleted files and folders will appear here until they are permanently removed."
        />
      )}

      {/* Trash Table */}
      {!isLoading && hasItems && (
        <div className="bg-white rounded-xl border border-outline shadow-level-1 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-9 border-b border-outline bg-surface-dim/50 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4 w-32">Original Size</th>
                <th className="py-2 px-4 w-36">Trashed Date</th>
                <th className="py-2 px-4 w-36">Retention</th>
                <th className="py-2 px-4 w-36 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-dim text-xs">
              {/* Trashed Folders */}
              {trashData.folders.map((folder) => (
                <tr key={folder.id} className="h-12 hover:bg-surface-dim transition-colors group">
                  <td className="py-2 px-4 font-medium text-on-surface">
                    <div className="flex items-center gap-2.5 truncate">
                      {getFolderIcon(18)}
                      <span className="truncate">{folder.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-on-surface-muted">—</td>
                  <td className="py-2 px-4 text-on-surface-muted">
                    {formatDate(folder.trashedAt)}
                  </td>
                  <td className="py-2 px-4">
                    <Badge variant="warning" size="sm" className="gap-1">
                      <Clock size={11} />
                      {folder.daysRemaining} days left
                    </Badge>
                  </td>
                  <td className="py-2 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore('folder', folder.id)}
                        leftIcon={<RotateCcw size={13} />}
                        title="Restore Folder"
                      >
                        Restore
                      </Button>
                      <button
                        type="button"
                        onClick={() => handlePurge('folder', folder.id)}
                        className="p-1.5 text-on-surface-muted hover:text-accent-error hover:bg-surface-dim rounded-lg"
                        title="Delete Permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* Trashed Files */}
              {trashData.files.map((file) => (
                <tr key={file.id} className="h-12 hover:bg-surface-dim transition-colors group">
                  <td className="py-2 px-4 font-medium text-on-surface">
                    <div className="flex items-center gap-2.5 truncate">
                      {getFileIcon(file.extension, file.mimeType, 18)}
                      <span className="truncate">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-on-surface-muted">
                    {formatBytes(file.sizeBytes)}
                  </td>
                  <td className="py-2 px-4 text-on-surface-muted">
                    {formatDate(file.trashedAt)}
                  </td>
                  <td className="py-2 px-4">
                    <Badge variant="warning" size="sm" className="gap-1">
                      <Clock size={11} />
                      {file.daysRemaining} days left
                    </Badge>
                  </td>
                  <td className="py-2 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRestore('file', file.id)}
                        leftIcon={<RotateCcw size={13} />}
                        title="Restore File"
                      >
                        Restore
                      </Button>
                      <button
                        type="button"
                        onClick={() => handlePurge('file', file.id)}
                        className="p-1.5 text-on-surface-muted hover:text-accent-error hover:bg-surface-dim rounded-lg"
                        title="Delete Permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty Trash Confirmation Modal */}
      <Modal
        isOpen={isEmptyModalOpen}
        onClose={() => setIsEmptyModalOpen(false)}
        title="Empty Trash Permanently?"
        description="All items in the trash will be deleted immediately. This action cannot be undone."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsEmptyModalOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleEmptyTrash}
              isLoading={isProcessing}
              leftIcon={<Trash2 size={15} />}
            >
              Empty Trash Forever
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-3 p-3 bg-accent-error-container text-accent-error-on rounded-xl border border-accent-error/20">
          <AlertTriangle size={18} className="shrink-0" />
          <p className="text-xs leading-relaxed">
            All files and folders currently in the trash will be wiped from object storage and cannot be restored.
          </p>
        </div>
      </Modal>
    </div>
  );
}