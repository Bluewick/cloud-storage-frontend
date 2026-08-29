import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { FolderPlus } from 'lucide-react';
import { useFolders } from '../../hooks/useFolders';

export function CreateFolderModal({ isOpen, onClose, currentFolderId, onSuccess }) {
  const [folderName, setFolderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { createFolder } = useFolders();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError('Folder name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await createFolder(folderName.trim(), currentFolderId || null);
      setFolderName('');
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create folder');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Folder"
      description="Organize your files by creating a new directory."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<FolderPlus size={15} />}
          >
            Create Folder
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Folder Name"
          value={folderName}
          onChange={(e) => {
            setFolderName(e.target.value);
            if (error) setError('');
          }}
          placeholder="e.g. Marketing Assets"
          error={error}
          autoFocus
        />
      </form>
    </Modal>
  );
}