import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { sharesApi } from '../api/shares.api';
import { filesApi } from '../api/files.api';
import { getFileIcon, getFolderIcon } from '../utils/fileIcons';
import { formatBytes, formatDate, formatRelativeTime } from '../utils/formatters';
import { Badge } from '../components/common/Badge';
import { GridCardSkeleton, TableRowSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import {
  Users,
  Download,
  LayoutGrid,
  List,
  Search,
  ArrowUpDown,
  Folder,
  ChevronRight,
  Loader2,
  Share2,
  Calendar,
  User,
} from 'lucide-react';

export function SharedWithMePage() {
  const navigate = useNavigate();
  const [data, setData] = useState({ folders: [], files: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState({ key: 'sharedAt', order: 'desc' }); // 'sharedAt' | 'name' | 'size' | 'sharedBy'
  const [downloadingId, setDownloadingId] = useState(null);

  const loadSharedResources = async () => {
    setIsLoading(true);
    try {
      const res = await sharesApi.getSharedWithMe();
      if (res?.data) {
        setData({
          folders: res.data.folders || [],
          files: res.data.files || [],
        });
      }
    } catch (err) {
      console.error('Failed to load shared items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSharedResources();
  }, []);

  const handleDownload = async (file) => {
    setDownloadingId(file.id);
    try {
      const res = await filesApi.getDownloadUrl(file.id);
      if (res?.data?.downloadUrl) {
        const link = document.createElement('a');
        link.href = res.data.downloadUrl;
        link.download = res.data.name || file.name || 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error('Download failed:', err);
      alert(err.message || 'Failed to generate download URL');
    } finally {
      setDownloadingId(null);
    }
  };

  // Filter and Sort Folders
  const processedFolders = useMemo(() => {
    let result = [...data.folders];

    // Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.folder?.name?.toLowerCase().includes(q) ||
          item.sharedBy?.name?.toLowerCase().includes(q) ||
          item.sharedBy?.email?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy.key === 'name') {
        valA = a.folder?.name?.toLowerCase() || '';
        valB = b.folder?.name?.toLowerCase() || '';
      } else if (sortBy.key === 'sharedBy') {
        valA = (a.sharedBy?.name || a.sharedBy?.email || '').toLowerCase();
        valB = (b.sharedBy?.name || b.sharedBy?.email || '').toLowerCase();
      } else {
        // default sharedAt
        valA = new Date(a.sharedAt || 0).getTime();
        valB = new Date(b.sharedAt || 0).getTime();
      }

      if (valA < valB) return sortBy.order === 'asc' ? -1 : 1;
      if (valA > valB) return sortBy.order === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [data.folders, searchQuery, sortBy]);

  // Filter and Sort Files
  const processedFiles = useMemo(() => {
    let result = [...data.files];

    // Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.file?.name?.toLowerCase().includes(q) ||
          item.sharedBy?.name?.toLowerCase().includes(q) ||
          item.sharedBy?.email?.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy.key === 'name') {
        valA = a.file?.name?.toLowerCase() || '';
        valB = b.file?.name?.toLowerCase() || '';
      } else if (sortBy.key === 'size') {
        valA = a.file?.sizeBytes || 0;
        valB = b.file?.sizeBytes || 0;
      } else if (sortBy.key === 'sharedBy') {
        valA = (a.sharedBy?.name || a.sharedBy?.email || '').toLowerCase();
        valB = (b.sharedBy?.name || b.sharedBy?.email || '').toLowerCase();
      } else {
        // default sharedAt
        valA = new Date(a.sharedAt || 0).getTime();
        valB = new Date(b.sharedAt || 0).getTime();
      }

      if (valA < valB) return sortBy.order === 'asc' ? -1 : 1;
      if (valA > valB) return sortBy.order === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [data.files, searchQuery, sortBy]);

  const isEmpty = !isLoading && data.folders.length === 0 && data.files.length === 0;
  const noMatches = !isLoading && !isEmpty && processedFolders.length === 0 && processedFiles.length === 0;

  return (
    <div className="space-y-6">
      {/* Top Header & Controls Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
            <Users size={22} className="text-primary" />
            Shared with me
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Files and folders shared directly with your account by team collaborators.
          </p>
        </div>

        {/* Toolbar Strip */}
        {!isEmpty && (
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Search Input */}
            <div className="relative w-48 sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted" />
              <input
                type="text"
                placeholder="Search shared items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-white border border-outline rounded-xl text-xs text-on-surface placeholder:text-on-surface-muted focus:border-primary outline-none shadow-sm transition-all"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-outline rounded-xl px-2.5 h-9 shadow-sm">
              <ArrowUpDown size={13} className="text-on-surface-muted" />
              <select
                value={`${sortBy.key}-${sortBy.order}`}
                onChange={(e) => {
                  const [key, order] = e.target.value.split('-');
                  setSortBy({ key, order });
                }}
                className="text-xs font-medium text-on-surface bg-transparent outline-none cursor-pointer pr-1"
              >
                <option value="sharedAt-desc">Date Shared (Newest)</option>
                <option value="sharedAt-asc">Date Shared (Oldest)</option>
                <option value="name-asc">Name (A to Z)</option>
                <option value="name-desc">Name (Z to A)</option>
                <option value="size-desc">Size (Largest)</option>
                <option value="sharedBy-asc">Shared By (A to Z)</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-surface-dim border border-outline rounded-xl shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-primary shadow-sm font-semibold' : 'text-on-surface-muted hover:text-on-surface'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white text-primary shadow-sm font-semibold' : 'text-on-surface-muted hover:text-on-surface'
                }`}
                title="List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <GridCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-outline">
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <EmptyState
          icon={<Users size={40} className="text-primary" />}
          title="No shared items yet"
          description="When other workspace members share folders or files with you, they will appear here."
        />
      )}

      {/* Search No Results */}
      {noMatches && (
        <EmptyState
          icon={<Search size={36} className="text-on-surface-muted" />}
          title="No matching shared items"
          description={`No files or folders matching "${searchQuery}" were found.`}
        />
      )}

      {/* GRID VIEW */}
      {!isLoading && !isEmpty && !noMatches && viewMode === 'grid' && (
        <div className="space-y-6">
          {/* Folders Grid */}
          {processedFolders.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted mb-3">
                Shared Folders ({processedFolders.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {processedFolders.map((item) => {
                  const folder = item.folder;
                  return (
                    <div
                      key={item.shareId}
                      onClick={() => navigate(`/drive/${folder.id}`)}
                      className="group bg-white border border-outline hover:border-primary/40 rounded-xl p-3.5 shadow-level-1 hover:shadow-md transition-all cursor-pointer select-none flex flex-col justify-between h-36"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="p-2 rounded-lg bg-blue-50/70 text-primary shrink-0">
                          {getFolderIcon(22, folder.isStarred)}
                        </div>
                        <Badge
                          variant={item.permission === 'editor' ? 'primary' : 'default'}
                          size="sm"
                          className="capitalize shrink-0 text-[10px]"
                        >
                          {item.permission}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                          {folder.name}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-on-surface-muted mt-2 pt-2 border-t border-surface-dim">
                          <span className="truncate flex items-center gap-1">
                            <User size={11} className="text-on-surface-muted shrink-0" />
                            <span className="truncate">{item.sharedBy?.name || item.sharedBy?.email}</span>
                          </span>
                          <span className="shrink-0">{formatRelativeTime(item.sharedAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Files Grid */}
          {processedFiles.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-muted mb-3">
                Shared Files ({processedFiles.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {processedFiles.map((item) => {
                  const file = item.file;
                  const isDownloading = downloadingId === file.id;
                  const thumbUrl = file.thumbnailUrl || file.thumbnail_url;
                  return (
                    <div
                      key={item.shareId}
                      className="group bg-white border border-outline hover:border-primary/40 rounded-xl p-3 shadow-level-1 hover:shadow-md transition-all select-none flex flex-col justify-between h-48"
                    >
                      <div className="relative w-full">
                        {thumbUrl ? (
                          <div className="w-full h-24 rounded-lg overflow-hidden bg-surface-dim border border-outline relative">
                            <img
                              src={thumbUrl}
                              alt={file.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="hidden w-full h-full items-center justify-center bg-surface-dim">
                              {getFileIcon(file.extension, file.mimeType, 24)}
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-surface-dim border border-outline inline-flex">
                            {getFileIcon(file.extension, file.mimeType, 24)}
                          </div>
                        )}

                        <div className={`flex items-center gap-1.5 ${thumbUrl ? 'absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm rounded-lg p-0.5 shadow-sm' : 'absolute top-0 right-0'}`}>
                          <Badge
                            variant={item.permission === 'editor' ? 'primary' : 'default'}
                            size="sm"
                            className="capitalize text-[10px]"
                          >
                            {item.permission}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => handleDownload(file)}
                            disabled={isDownloading}
                            className="p-1.5 text-on-surface-muted hover:text-primary hover:bg-surface-dim rounded-lg transition-colors"
                            title="Download File"
                          >
                            {isDownloading ? (
                              <Loader2 size={14} className="animate-spin text-primary" />
                            ) : (
                              <Download size={14} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                          {file.name}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-on-surface-muted mt-1">
                          <span>{formatBytes(file.sizeBytes)}</span>
                          <span>{formatDate(item.sharedAt)}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t border-surface-dim flex items-center gap-1 text-[11px] text-on-surface-muted truncate">
                          <User size={11} className="shrink-0" />
                          <span className="truncate">By {item.sharedBy?.name || item.sharedBy?.email}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* LIST / TABLE VIEW */}
      {!isLoading && !isEmpty && !noMatches && viewMode === 'list' && (
        <div className="bg-white rounded-xl border border-outline shadow-level-1 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-9 border-b border-outline bg-surface-dim/50 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                <th className="py-2.5 px-4">Name</th>
                <th className="py-2.5 px-4 w-44">Shared By</th>
                <th className="py-2.5 px-4 w-28">Permission</th>
                <th className="py-2.5 px-4 w-28">Size</th>
                <th className="py-2.5 px-4 w-36">Date Shared</th>
                <th className="py-2.5 px-4 w-16 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-dim text-xs">
              {/* Folders Rows */}
              {processedFolders.map((item) => {
                const folder = item.folder;
                return (
                  <tr
                    key={item.shareId}
                    onClick={() => navigate(`/drive/${folder.id}`)}
                    className="h-12 hover:bg-surface-dim transition-colors group cursor-pointer"
                  >
                    <td className="py-2 px-4 font-medium text-on-surface">
                      <div className="flex items-center gap-2.5 truncate">
                        {getFolderIcon(18, folder.isStarred)}
                        <span className="truncate group-hover:text-primary transition-colors font-semibold">
                          {folder.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-on-surface-variant">
                      <div className="truncate">
                        <span className="font-medium text-on-surface block truncate">
                          {item.sharedBy?.name || 'Collaborator'}
                        </span>
                        <span className="text-[11px] text-on-surface-muted block truncate">
                          {item.sharedBy?.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <Badge
                        variant={item.permission === 'editor' ? 'primary' : 'default'}
                        size="sm"
                        className="capitalize"
                      >
                        {item.permission}
                      </Badge>
                    </td>
                    <td className="py-2 px-4 text-on-surface-muted">—</td>
                    <td className="py-2 px-4 text-on-surface-muted">
                      {formatDate(item.sharedAt)}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <ChevronRight size={15} className="text-on-surface-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-auto" />
                    </td>
                  </tr>
                );
              })}

              {/* Files Rows */}
              {processedFiles.map((item) => {
                const file = item.file;
                const isDownloading = downloadingId === file.id;
                return (
                  <tr key={item.shareId} className="h-12 hover:bg-surface-dim transition-colors group">
                    <td className="py-2 px-4 font-medium text-on-surface">
                      <div className="flex items-center gap-2.5 truncate">
                        {file.thumbnailUrl || file.thumbnail_url ? (
                          <div className="w-7 h-7 rounded-md overflow-hidden bg-surface-dim border border-outline shrink-0">
                            <img
                              src={file.thumbnailUrl || file.thumbnail_url}
                              alt={file.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                if (e.currentTarget.nextElementSibling) {
                                  e.currentTarget.nextElementSibling.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="hidden w-full h-full items-center justify-center">
                              {getFileIcon(file.extension, file.mimeType, 16)}
                            </div>
                          </div>
                        ) : (
                          getFileIcon(file.extension, file.mimeType, 18)
                        )}
                        <span className="truncate group-hover:text-primary transition-colors font-semibold">
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4 text-on-surface-variant">
                      <div className="truncate">
                        <span className="font-medium text-on-surface block truncate">
                          {item.sharedBy?.name || 'Collaborator'}
                        </span>
                        <span className="text-[11px] text-on-surface-muted block truncate">
                          {item.sharedBy?.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <Badge
                        variant={item.permission === 'editor' ? 'primary' : 'default'}
                        size="sm"
                        className="capitalize"
                      >
                        {item.permission}
                      </Badge>
                    </td>
                    <td className="py-2 px-4 text-on-surface-muted font-mono text-[11px]">
                      {formatBytes(file.sizeBytes)}
                    </td>
                    <td className="py-2 px-4 text-on-surface-muted">
                      {formatDate(item.sharedAt)}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownload(file)}
                        disabled={isDownloading}
                        className="p-1.5 text-on-surface-muted hover:text-primary hover:bg-white rounded-lg transition-colors inline-flex items-center justify-center"
                        title="Download"
                      >
                        {isDownloading ? (
                          <Loader2 size={14} className="animate-spin text-primary" />
                        ) : (
                          <Download size={14} />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}