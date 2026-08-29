import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Trash2, AlertTriangle } from 'lucide-react';
import { foldersApi } from '../../api/folders.api';
import { filesApi } from '../../api/files.api';

export function DeleteConfirmModal({ isOpen, onClose, item, resourceType, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      if (resourceType === 'folder') {
        await foldersApi.deleteFolder(item.id);
      } else {
        await filesApi.deleteFile(item.id);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to move item to trash');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Move to Trash?"
      description={`Are you sure you want to move "${item?.name}" to trash? You can restore it within 30 days.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={isSubmitting}
            leftIcon={<Trash2 size={15} />}
          >
            Move to Trash
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-3 p-3 bg-accent-warning-container text-accent-warning-on rounded-xl border border-accent-warning/20">
        <AlertTriangle size={18} className="shrink-0" />
        <p className="text-xs leading-relaxed">
          {resourceType === 'folder'
            ? 'All files and sub-folders contained inside will also be moved to trash.'
            : 'This file will no longer be accessible via shared links until restored.'}
        </p>
      </div>
      {error && <p className="text-xs text-accent-error mt-2">{error}</p>}
    </Modal>
  );
}