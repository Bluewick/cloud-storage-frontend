import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { foldersApi } from '../../api/folders.api';
import { filesApi } from '../../api/files.api';
import { Folder, ChevronRight, ChevronDown, HardDrive, Loader2 } from 'lucide-react';

function TreeNode({ node, selectedId, onSelect, currentItemId }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isSelected = selectedId === node.id;
  const isSelfOrChild = node.id === currentItemId;
  const hasChildren = node.children && node.children.length > 0;

  if (isSelfOrChild) return null; // Prevent moving a folder into itself

  return (
    <div className="select-none">
      <div
        onClick={() => onSelect(node.id)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs transition-colors ${
          isSelected
            ? 'bg-primary-container text-primary font-semibold'
            : 'text-on-surface hover:bg-surface-dim'
        }`}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
            className="p-0.5 text-on-surface-muted hover:text-on-surface"
          >
            {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
        ) : (
          <span className="w-4" />
        )}

        <Folder size={15} className={isSelected ? 'text-primary' : 'text-blue-500'} />
        <span className="truncate">{node.name}</span>
      </div>

      {hasChildren && isExpanded && (
        <div className="pl-4 ml-2 border-l border-outline my-0.5 space-y-0.5">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              currentItemId={currentItemId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MoveResourceModal({ isOpen, onClose, item, resourceType, onSuccess }) {
  const [tree, setTree] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null); // null means root
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError('');
      foldersApi
        .getHierarchyTree()
        .then((res) => {
          setTree(res?.data || []);
        })
        .catch((err) => {
          setError(err.message || 'Failed to load folder tree');
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  const handleMove = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      if (resourceType === 'folder') {
        await foldersApi.moveFolder(item.id, selectedFolderId);
      } else {
        await filesApi.moveFile(item.id, selectedFolderId);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to move resource');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Move "${item?.name || 'Resource'}"`}
      description="Choose a destination folder."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleMove} isLoading={isSubmitting}>
            Move Here
          </Button>
        </>
      }
    >
      {error && <p className="text-xs text-accent-error mb-3">{error}</p>}

      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto border border-outline rounded-xl p-2 bg-surface/30">
          {/* Root Directory Option */}
          <div
            onClick={() => setSelectedFolderId(null)}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-xs mb-1 transition-colors ${
              selectedFolderId === null
                ? 'bg-primary-container text-primary font-semibold'
                : 'text-on-surface hover:bg-surface-dim'
            }`}
          >
            <HardDrive size={15} className={selectedFolderId === null ? 'text-primary' : 'text-on-surface-muted'} />
            <span>My Drive (Root)</span>
          </div>

          {/* Folder Hierarchy */}
          {tree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              selectedId={selectedFolderId}
              onSelect={setSelectedFolderId}
              currentItemId={resourceType === 'folder' ? item?.id : null}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}