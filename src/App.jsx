// import { useState } from "react";

// import "./App.css";

// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Landing from "./pages/Landing";
// import { Navigate, Route, Routes } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// export function ProtectedRoute({ children }) {
//   const { token, loading } = useAuth();

//   if (loading) return <div>Loading...</div>; 
//   return token ? children : <Navigate to="/" replace />;
// }

// export function PublicRoute({ children }) {
//   const { token, loading } = useAuth();

//   if (loading) return <div>Loading...</div>; 

//   return token ? <Navigate to="/dashboard" replace /> : children;
// }

// function App() {
//   return (
//     <>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <PublicRoute>
//               <Landing />
//             </PublicRoute>
//           }
//         />
//         {/* <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         /> */}

//         <Route
//           path="/login"
//           element={
//             <PublicRoute>
//               <Login />
//             </PublicRoute>
//           }
//         />

//         <Route
//           path="/signup"
//           element={
//             <PublicRoute>
//               <Signup />
//             </PublicRoute>
//           }
//         />
//       </Routes>
//     </>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExplorerProvider } from './context/ExplorerContext';
import { UploadProvider } from './context/UploadContext';
import { DropzoneOverlay } from './components/upload/DropzoneOverlay';
import { UploadDrawer } from './components/upload/UploadDrawer';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ExplorerProvider>
          <UploadProvider>
            {/* Global Drag & Drop Listener */}
            <DropzoneOverlay />

            {/* Floating Upload Queue Drawer */}
            <UploadDrawer />

            {/* Client-Side Application Routes */}
            <AppRoutes />
          </UploadProvider>
        </ExplorerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
