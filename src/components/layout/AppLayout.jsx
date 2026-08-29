import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';

export function AppLayout({ onOpenNewFolder, onOpenUpload }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global ⌘K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface font-sans antialiased text-on-surface">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0 h-full">
        <Sidebar
          onOpenNewFolder={onOpenNewFolder}
          onOpenUpload={onOpenUpload}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <div className="relative z-10 w-64 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            <Sidebar
              onOpenNewFolder={onOpenNewFolder}
              onOpenUpload={onOpenUpload}
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenNewFolder={onOpenNewFolder}
          onOpenUpload={onOpenUpload}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Scrollable Page View */}
        <main className="flex-1 overflow-y-auto bg-surface p-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}