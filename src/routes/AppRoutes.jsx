import React, { useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { DrivePage } from '../pages/DrivePage';
import { SharedWithMePage } from '../pages/SharedWithMePage';
import { StarredPage } from '../pages/StarredPage';
import { RecentsPage } from '../pages/RecentsPage';
import { TrashPage } from '../pages/TrashPage';
import { SettingsPage } from '../pages/SettingsPage';
import { PublicViewPage } from '../pages/PublicViewPage';

import { useAuth } from '../context/AuthContext';
import { useExplorer } from '../context/ExplorerContext';
import { useUpload } from '../context/UploadContext';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Landing from '../pages/Landing';

export function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();
  const { openModal, currentFolder } = useExplorer();
  const { uploadFiles } = useUpload();

  const handleTriggerUpload = useCallback(() => {
    const input = document.createElement('input');

    input.type = 'file';
    input.multiple = true;

    input.onchange = (e) => {
      if (e.target.files?.length) {
        uploadFiles(
          e.target.files,
          currentFolder?.id || null
        );
      }
    };

    input.click();
  }, [uploadFiles, currentFolder?.id]);

  const handleOpenNewFolder = useCallback(() => {
    openModal('create-folder');
  }, [openModal]);

  // 1. Prevent router flash while AuthProvider verifies token/user on boot
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <Routes>
      {/* 2. Root route: Redirects to /drive if authenticated, else renders Landing */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/drive" replace /> : <Landing />
        }
      />

      <Route path="/s/:token" element={<PublicViewPage />} />

      {/* 3. Auth routes: Redirect logged-in users away from login/signup */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/drive" replace /> : <Login />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/drive" replace /> : <Signup />
        }
      />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <AppLayout
              onOpenNewFolder={handleOpenNewFolder}
              onOpenUpload={handleTriggerUpload}
            />
          }
        >
          <Route
            path="/drive"
            element={<DrivePage onOpenUpload={handleTriggerUpload} />}
          />

          <Route
            path="/drive/:folderId"
            element={<DrivePage onOpenUpload={handleTriggerUpload} />}
          />

          <Route
            path="/shared-with-me"
            element={<SharedWithMePage />}
          />

          <Route
            path="/starred"
            element={<StarredPage />}
          />

          <Route
            path="/recents"
            element={<RecentsPage />}
          />

          <Route
            path="/trash"
            element={<TrashPage />}
          />

          <Route
            path="/settings"
            element={<SettingsPage />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}