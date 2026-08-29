import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { foldersApi } from '../../api/folders.api';
import { filesApi } from '../../api/files.api';

export function RenameModal({ isOpen, onClose, item, resourceType, onSuccess }) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setName(item.name || '');
      setError('');
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      if (resourceType === 'folder') {
        await foldersApi.renameFolder(item.id, name.trim());
      } else {
        await filesApi.renameFile(item.id, name.trim());
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to rename item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Rename ${resourceType === 'folder' ? 'Folder' : 'File'}`}
      description="Enter a new name for this resource."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting}>
            Save Changes
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          placeholder="New name..."
          error={error}
          autoFocus
        />
      </form>
    </Modal>
  );
}