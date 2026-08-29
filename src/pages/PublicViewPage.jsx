import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { publicLinksApi } from '../api/publicLinks.api';
import { getFileIcon, getFolderIcon } from '../utils/fileIcons';
import { formatBytes, formatDate } from '../utils/formatters';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import {
  Download,
  Lock,
  Cloud,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Folder,
  FolderOpen,
  ChevronRight,
  LayoutGrid,
  List,
  Search,
  ArrowLeft,
  FileText,
  Shield,
  Eye,
} from 'lucide-react';

export function PublicViewPage() {
  const { token } = useParams();
  const [resource, setResource] = useState(null);
  const [resourceType, setResourceType] = useState('resource');
  const [password, setPassword] = useState('');
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Navigation & View State
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingFileId, setDownloadingFileId] = useState(null);
  const [isDownloadingSingleFile, setIsDownloadingSingleFile] = useState(false);

  const fetchResource = async (pwd = '', folderId = null) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await publicLinksApi.viewPublicResource(token, pwd, folderId);
      if (res?.data) {
        if (res.data.passwordRequired) {
          setIsPasswordRequired(true);
          setResourceType(res.data.resourceType || 'resource');
          if (pwd) {
            setError('Incorrect password. Please try again.');
          }
        } else {
          setResource(res.data);
          setResourceType(res.data.resourceType || (res.data.folder ? 'folder' : 'file'));
          if (res.data.currentFolder) {
            setCurrentFolderId(res.data.currentFolder.id);
          }
          setIsPasswordRequired(false);
        }
      }
    } catch (err) {
      if (
        err.response?.status === 401 ||
        err.code === 'PASSWORD_REQUIRED' ||
        err.response?.data?.error?.code === 'INVALID_LINK_PASSWORD'
      ) {
        setIsPasswordRequired(true);
        if (pwd || err.response?.data?.error?.message) {
          setError(err.response?.data?.error?.message || 'Incorrect password. Please try again.');
        }
      } else {
        const errorMsg =
          err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          'This share link has expired or is invalid.';
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchResource();
  }, [token]);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password) fetchResource(password, currentFolderId);
  };

  const handleNavigateFolder = (folderId) => {
    setSearchQuery('');
    fetchResource(password, folderId);
  };

  // Download a single file or a file inside a folder
  const handleDownloadFile = async (fileId = null) => {
    if (fileId) {
      setDownloadingFileId(fileId);
    } else {
      setIsDownloadingSingleFile(true);
    }

    try {
      const res = await publicLinksApi.downloadPublicResource(token, password, fileId);
      if (res?.data?.downloadUrl) {
        const link = document.createElement('a');
        link.href = res.data.downloadUrl;
        link.download = res.data.name || 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      alert(err.response?.data?.error?.message || err.message || 'Failed to generate download link.');
    } finally {
      if (fileId) {
        setDownloadingFileId(null);
      } else {
        setIsDownloadingSingleFile(false);
      }
    }
  };

  const isFolder = resource && (resource.resourceType === 'folder' || resource.folder);
  const isFile = resource && (resource.resourceType === 'file' || resource.file);

  // Filtered files & folders for search
  const filteredFolders = useMemo(() => {
    if (!resource?.folders) return [];
    if (!searchQuery.trim()) return resource.folders;
    return resource.folders.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [resource?.folders, searchQuery]);

  const filteredFiles = useMemo(() => {
    if (!resource?.files) return [];
    if (!searchQuery.trim()) return resource.files;
    return resource.files.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [resource?.files, searchQuery]);

  return (
    <div className="min-h-screen w-screen bg-slate-50/60 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] flex flex-col justify-between items-center font-sans antialiased text-slate-800">
      {/* Top Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Cloud size={18} />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-slate-900 block leading-tight">
              Lumina Vault
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">
              Public Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm" className="hidden sm:inline-flex items-center gap-1.5 py-1 px-2.5 bg-slate-50 border-slate-200 text-slate-600">
            <Eye size={12} className="text-blue-500" />
            <span>Public Shared View</span>
          </Badge>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
            <Shield size={12} className="text-emerald-600" />
            <span>Secure Link</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl px-4 sm:px-6 py-8 flex-1 flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-12 shadow-sm text-center max-w-sm w-full space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary mx-auto flex items-center justify-center animate-pulse">
              <Loader2 className="animate-spin" size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">Accessing Resource</h4>
              <p className="text-xs text-slate-400 mt-0.5">Fetching verified storage metadata...</p>
            </div>
          </div>
        ) : isPasswordRequired ? (
          /* Password Form Card */
          <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200 shadow-sm mb-5">
              <Lock size={28} />
            </div>
            
            <h3 className="text-lg font-bold text-slate-900">Protected Share Link</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              This {resourceType === 'folder' ? 'folder' : 'file'} is protected with an end-to-end access password.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4 mt-6">
              <div className="text-left">
                <Input
                  type="password"
                  placeholder="Enter link password..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  error={error}
                  autoFocus
                  className="text-center font-medium"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-semibold shadow-md shadow-blue-600/20"
              >
                Unlock & View
              </Button>
            </form>
          </div>
        ) : isFile ? (
          /* Single File Card */
          <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {resource.file.thumbnailUrl || resource.file.thumbnail_url ? (
              <div className="w-full max-h-56 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center">
                <img
                  src={resource.file.thumbnailUrl || resource.file.thumbnail_url}
                  alt={resource.file.name}
                  className="w-full h-full object-contain max-h-56"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-slate-50 border border-slate-200/80 mx-auto flex items-center justify-center shadow-inner">
                {getFileIcon(resource.file.extension, resource.file.mimeType, 48)}
              </div>
            )}

            <div>
              <h3 className="text-lg font-bold text-slate-900 break-words px-2">
                {resource.file.name}
              </h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="default" size="sm">
                  {formatBytes(resource.file.sizeBytes)}
                </Badge>
                <Badge variant="outline" size="sm" className="uppercase font-mono">
                  {resource.file.extension || 'FILE'}
                </Badge>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Created:</span>
                <span className="font-semibold text-slate-700">{formatDate(resource.file.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Access Mode:</span>
                <span className="font-semibold text-slate-700 capitalize">{resource.permission || 'Viewer'}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => handleDownloadFile()}
              isLoading={isDownloadingSingleFile}
              leftIcon={<Download size={18} />}
              className="w-full font-semibold shadow-lg shadow-blue-600/25 h-12"
            >
              Download File
            </Button>
          </div>
        ) : isFolder ? (
          /* Shared Folder Explorer Interface */
          <div className="w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Folder Header Bar */}
            <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-primary shrink-0 shadow-sm">
                    {getFolderIcon(28)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">
                      {resource.currentFolder?.name || resource.folder?.name || 'Shared Folder'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {(filteredFolders.length + filteredFiles.length)} items in this directory
                    </p>
                  </div>
                </div>

                {/* Toolbar Controls */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {/* Search bar */}
                  <div className="relative w-44 sm:w-56">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Filter items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-8 pl-8 pr-3 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-primary transition-all"
                    />
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center p-0.5 bg-slate-100 border border-slate-200 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg text-slate-600 transition-colors ${
                        viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'hover:text-slate-900'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-lg text-slate-600 transition-colors ${
                        viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'hover:text-slate-900'
                      }`}
                      title="List View"
                    >
                      <List size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Breadcrumbs Navigation Strip */}
              {resource.breadcrumbs && resource.breadcrumbs.length > 0 && (
                <div className="flex items-center flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-100 text-xs">
                  {resource.breadcrumbs.map((crumb, idx) => {
                    const isLast = idx === resource.breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={crumb.id}>
                        {idx > 0 && <ChevronRight size={13} className="text-slate-300 shrink-0" />}
                        <button
                          type="button"
                          onClick={() => handleNavigateFolder(crumb.id)}
                          disabled={isLast}
                          className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1.5 font-medium ${
                            isLast
                              ? 'bg-blue-50/70 text-primary font-semibold cursor-default'
                              : 'text-slate-600 hover:text-primary hover:bg-slate-100'
                          }`}
                        >
                          <Folder size={13} className={isLast ? 'text-primary' : 'text-slate-400'} />
                          <span>{crumb.name}</span>
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Folder Body / Content Area */}
            <div className="p-5 sm:p-6 min-h-[280px]">
              {filteredFolders.length === 0 && filteredFiles.length === 0 ? (
                <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300">
                    <FolderOpen size={28} />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-700 mt-2">
                    {searchQuery ? 'No matching items' : 'This folder is empty'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs">
                    {searchQuery
                      ? `No files or folders matching "${searchQuery}" found in this directory.`
                      : 'There are no files or subfolders uploaded to this directory yet.'}
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                /* GRID VIEW */
                <div className="space-y-6">
                  {/* Subfolders Grid */}
                  {filteredFolders.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                        Folders ({filteredFolders.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {filteredFolders.map((f) => (
                          <div
                            key={f.id}
                            onClick={() => handleNavigateFolder(f.id)}
                            className="group flex items-center justify-between p-3.5 bg-white hover:bg-blue-50/30 border border-slate-200 hover:border-primary/40 rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer select-none"
                          >
                            <div className="flex items-center gap-3 truncate flex-1 pr-2">
                              <div className="p-2 rounded-xl bg-blue-50/80 group-hover:bg-blue-100/70 transition-colors text-primary shrink-0">
                                {getFolderIcon(20)}
                              </div>
                              <span className="text-xs font-semibold text-slate-800 group-hover:text-primary transition-colors truncate">
                                {f.name}
                              </span>
                            </div>
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files Grid */}
                  {filteredFiles.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
                        Files ({filteredFiles.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {filteredFiles.map((fi) => {
                          const thumbUrl = fi.thumbnailUrl || fi.thumbnail_url;
                          return (
                            <div
                              key={fi.id}
                              className="group flex flex-col justify-between p-3.5 bg-white border border-slate-200 hover:border-primary/40 rounded-2xl shadow-sm hover:shadow transition-all select-none"
                            >
                              <div className="relative w-full">
                                {thumbUrl ? (
                                  <div className="w-full h-24 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 relative mb-2">
                                    <img
                                      src={thumbUrl}
                                      alt={fi.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        if (e.currentTarget.nextElementSibling) {
                                          e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }
                                      }}
                                    />
                                    <div className="hidden w-full h-full items-center justify-center bg-slate-50">
                                      {getFileIcon(fi.extension, fi.mimeType, 24)}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 inline-flex mb-2">
                                    {getFileIcon(fi.extension, fi.mimeType, 24)}
                                  </div>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleDownloadFile(fi.id)}
                                  disabled={downloadingFileId === fi.id}
                                  className={`p-2 rounded-xl text-slate-400 hover:text-primary hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-colors ${
                                    thumbUrl
                                      ? 'absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm shadow-sm'
                                      : 'absolute top-0 right-0'
                                  }`}
                                  title="Download File"
                                >
                                  {downloadingFileId === fi.id ? (
                                    <Loader2 size={15} className="animate-spin text-primary" />
                                  ) : (
                                    <Download size={15} />
                                  )}
                                </button>
                              </div>

                              <div className="mt-1">
                                <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">
                                  {fi.name}
                                </p>
                                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                                  <span>{formatBytes(fi.sizeBytes)}</span>
                                  <span>{formatDate(fi.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* LIST / TABLE VIEW */
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="h-9 border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        <th className="py-2.5 px-4">Name</th>
                        <th className="py-2.5 px-4 w-28">Size</th>
                        <th className="py-2.5 px-4 w-36">Created</th>
                        <th className="py-2.5 px-4 w-16 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {/* Subfolders Rows */}
                      {filteredFolders.map((f) => (
                        <tr
                          key={f.id}
                          onClick={() => handleNavigateFolder(f.id)}
                          className="h-12 hover:bg-slate-50/80 transition-colors group cursor-pointer"
                        >
                          <td className="py-2 px-4 font-medium text-slate-800">
                            <div className="flex items-center gap-2.5 truncate">
                              <div className="p-1 rounded-md bg-blue-50 text-primary">
                                {getFolderIcon(16)}
                              </div>
                              <span className="truncate group-hover:text-primary transition-colors">
                                {f.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-4 text-slate-400">—</td>
                          <td className="py-2 px-4 text-slate-400">{formatDate(f.createdAt)}</td>
                          <td className="py-2 px-4 text-right">
                            <ChevronRight size={15} className="text-slate-300 group-hover:text-primary ml-auto" />
                          </td>
                        </tr>
                      ))}

                      {/* Files Rows */}
                      {filteredFiles.map((fi) => (
                        <tr key={fi.id} className="h-12 hover:bg-slate-50/80 transition-colors group">
                          <td className="py-2 px-4 font-medium text-slate-800">
                            <div className="flex items-center gap-2.5 truncate">
                              {fi.thumbnailUrl || fi.thumbnail_url ? (
                                <div className="w-7 h-7 rounded-md overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                                  <img
                                    src={fi.thumbnailUrl || fi.thumbnail_url}
                                    alt={fi.name}
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
                                    {getFileIcon(fi.extension, fi.mimeType, 16)}
                                  </div>
                                </div>
                              ) : (
                                getFileIcon(fi.extension, fi.mimeType, 18)
                              )}
                              <span className="truncate group-hover:text-primary transition-colors">
                                {fi.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-4 text-slate-500 font-mono text-[11px]">
                            {formatBytes(fi.sizeBytes)}
                          </td>
                          <td className="py-2 px-4 text-slate-400">{formatDate(fi.createdAt)}</td>
                          <td className="py-2 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDownloadFile(fi.id)}
                              disabled={downloadingFileId === fi.id}
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center justify-center"
                              title="Download"
                            >
                              {downloadingFileId === fi.id ? (
                                <Loader2 size={14} className="animate-spin text-primary" />
                              ) : (
                                <Download size={14} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Error / Expired View Card */
          <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl shadow-slate-200/50 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center border border-rose-100 shadow-sm">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Resource Unavailable</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {error || 'This link has expired or has been revoked by the owner.'}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Strip */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>Powered by Lumina Vault Cloud Storage</span>
      </footer>
    </div>
  );
}