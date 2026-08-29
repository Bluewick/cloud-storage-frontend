import React from 'react';
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  FileArchive,
  Image,
  Video,
  Music,
  FileQuestion,
  Folder,
} from 'lucide-react';

export function getFileIcon(extension = '', mimeType = '', size = 20, className = '') {
  const ext = extension?.toLowerCase().replace('.', '');
  const mime = mimeType?.toLowerCase();

  // Images
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(ext) || mime?.startsWith('image/')) {
    return <Image size={size} className={`text-blue-500 ${className}`} />;
  }

  // PDFs & Docs
  if (ext === 'pdf' || mime === 'application/pdf') {
    return <FileText size={size} className={`text-red-500 ${className}`} />;
  }
  if (['doc', 'docx', 'txt', 'rtf', 'odt'].includes(ext) || mime?.includes('word')) {
    return <FileText size={size} className={`text-blue-600 ${className}`} />;
  }

  // Spreadsheets
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext) || mime?.includes('spreadsheet') || mime?.includes('csv')) {
    return <FileSpreadsheet size={size} className={`text-emerald-600 ${className}`} />;
  }

  // Videos
  if (['mp4', 'mkv', 'mov', 'webm', 'avi'].includes(ext) || mime?.startsWith('video/')) {
    return <Video size={size} className={`text-purple-500 ${className}`} />;
  }

  // Audio
  if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(ext) || mime?.startsWith('audio/')) {
    return <Music size={size} className={`text-amber-500 ${className}`} />;
  }

  // Archives
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || mime?.includes('zip') || mime?.includes('tar')) {
    return <FileArchive size={size} className={`text-yellow-600 ${className}`} />;
  }

  // Code
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'sql'].includes(ext)) {
    return <FileCode size={size} className={`text-cyan-600 ${className}`} />;
  }

  return <FileQuestion size={size} className={`text-slate-400 ${className}`} />;
}

export function getFolderIcon(size = 20, isStarred = false, className = '') {
  return (
    <Folder
      size={size}
      className={`${isStarred ? 'text-amber-500 fill-amber-500/20' : 'text-blue-600 fill-blue-600/10'} ${className}`}
    />
  );
}