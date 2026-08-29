import React, { useState, useEffect } from 'react';
import { UploadCloud } from 'lucide-react';
import { useUpload } from '../../context/UploadContext';
import { useExplorer } from '../../context/ExplorerContext';

export function DropzoneOverlay() {
  const [isDragging, setIsDragging] = useState(false);
  const { uploadFiles } = useUpload();
  const { currentFolder } = useExplorer();

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter = 0;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files, currentFolder?.id || null);
        e.dataTransfer.clearData();
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [uploadFiles, currentFolder]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-sm pointer-events-none animate-in fade-in duration-150">
      <div className="w-full max-w-2xl h-96 border-3 border-dashed border-primary bg-white/95 rounded-3xl flex flex-col items-center justify-center shadow-2xl p-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary-container text-primary flex items-center justify-center mb-4 animate-bounce">
          <UploadCloud size={40} />
        </div>
        <h3 className="text-xl font-bold text-on-surface">Drop files to upload</h3>
        <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm">
          Files will be uploaded directly to{' '}
          <span className="font-semibold text-primary">
            {currentFolder?.name || 'My Drive (Root)'}
          </span>
        </p>
      </div>
    </div>
  );
}