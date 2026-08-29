import React, { useState, useEffect } from 'react';
import { searchApi } from '../api/search.api';
import { filesApi } from '../api/files.api';
import { getFileIcon } from '../utils/fileIcons';
import { formatBytes, formatRelativeTime } from '../utils/formatters';
import { TableRowSkeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Clock, Download } from 'lucide-react';

export function RecentsPage() {
  const [recentFiles, setRecentFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecents = async () => {
      setIsLoading(true);
      try {
        const res = await searchApi.getRecents();
        setRecentFiles(res?.data || []);
      } catch (err) {
        console.error('Failed to load recent files:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadRecents();
  }, []);

  const handleDownload = async (file) => {
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
          <Clock size={22} className="text-primary" />
          Recent Files
        </h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          View recently modified or uploaded files in your workspace.
        </p>
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-outline">
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && recentFiles.length === 0 && (
        <EmptyState
          icon={<Clock size={36} className="text-on-surface-muted" />}
          title="No recent activity"
          description="Files you upload or modify will appear here."
        />
      )}

      {!isLoading && recentFiles.length > 0 && (
        <div className="bg-white rounded-xl border border-outline shadow-level-1 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="h-9 border-b border-outline bg-surface-dim/50 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4 w-32">Size</th>
                <th className="py-2 px-4 w-40">Last Touched</th>
                <th className="py-2 px-4 w-12 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-dim text-xs">
              {recentFiles.map((file) => (
                <tr key={file.id} className="h-12 hover:bg-surface-dim transition-colors group">
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
                      <span className="truncate">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-on-surface-muted">{formatBytes(file.sizeBytes)}</td>
                  <td className="py-2 px-4 text-on-surface-muted">
                    {formatRelativeTime(file.updatedAt || file.createdAt)}
                  </td>
                  <td className="py-2 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownload(file)}
                      className="p-1.5 text-on-surface-muted hover:text-primary hover:bg-white rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}