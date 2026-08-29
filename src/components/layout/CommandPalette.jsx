import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchApi } from '../../api/search.api';
import { getFileIcon, getFolderIcon } from '../../utils/fileIcons';
import { formatBytes } from '../../utils/formatters';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';

export function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ folders: [], files: [] });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults({ folders: [], files: [] });
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults({ folders: [], files: [] });
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await searchApi.search({ q: query, limit: 8 });
        if (res?.data) {
          setResults({
            folders: res.data.folders || [],
            files: res.data.files || [],
          });
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut listener (Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalResults = results.folders.length + results.files.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Level 3 Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
      />

      {/* Floating Modal Surface */}
      <div className="relative w-full max-w-xl bg-white rounded-xl border border-outline shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-outline">
          <Search size={18} className="text-on-surface-muted shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files, folders, or keywords..."
            className="w-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-muted outline-none"
          />
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-primary shrink-0" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-on-surface-muted hover:text-on-surface p-1"
            >
              <X size={15} />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-on-surface-muted bg-surface-dim border border-outline rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query.trim() && totalResults === 0 && !isLoading && (
            <div className="py-8 text-center text-xs text-on-surface-muted">
              No matching files or folders found for "{query}".
            </div>
          )}

          {!query.trim() && (
            <div className="py-6 text-center text-xs text-on-surface-muted">
              Type a keyword to instantly search across your workspace.
            </div>
          )}

          {/* Folders Section */}
          {results.folders.length > 0 && (
            <div className="mb-2">
              <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-on-surface-muted block">
                Folders
              </span>
              {results.folders.map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/drive/${folder.id}`);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-surface-dim text-left group transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {getFolderIcon(16, folder.isStarred)}
                    <span className="font-medium text-on-surface truncate">{folder.name}</span>
                  </div>
                  <ArrowRight size={13} className="text-on-surface-muted group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          )}

          {/* Files Section */}
          {results.files.length > 0 && (
            <div>
              <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-on-surface-muted block">
                Files
              </span>
              {results.files.map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(file.folderId ? `/drive/${file.folderId}` : '/drive');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-surface-dim text-left group transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {getFileIcon(file.extension, file.mimeType, 16)}
                    <span className="font-medium text-on-surface truncate">{file.name}</span>
                  </div>
                  <span className="text-[11px] text-on-surface-muted">
                    {formatBytes(file.sizeBytes)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}