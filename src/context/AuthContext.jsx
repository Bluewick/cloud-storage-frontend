import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usersApi } from '../api/users.api';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY, DEFAULT_STORAGE_LIMIT_BYTES } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(USER_STORAGE_KEY);
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [storage, setStorage] = useState({
    storageUsedBytes: 0,
    storageLimitBytes: DEFAULT_STORAGE_LIMIT_BYTES,
    remainingBytes: DEFAULT_STORAGE_LIMIT_BYTES,
    usagePercentage: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Refresh user storage quota from API
  const refreshStorage = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) return;
    try {
      const res = await usersApi.getStorageUsage();
      if (res?.data) {
        setStorage(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch storage usage:', err);
    }
  }, []);

  // Refresh user profile details
  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await usersApi.getMe();
      if (res?.data) {
        setUser(res.data);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));
      }
      await refreshStorage();
    } catch (err) {
      console.error('Failed to load user profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [refreshStorage]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Login handler
  const login = (authToken, userData) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    refreshStorage();
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  // Update user state directly after profile edits
  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        storage,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        refreshStorage,
        refreshUser,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext(null);

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5783';

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Initialize auth state from localStorage on load
//   useEffect(() => {
//     try {
//       const storedToken = localStorage.getItem('lumina_token');
//       const storedUser = localStorage.getItem('lumina_user');

//       if (storedToken && storedUser) {
//         setToken(storedToken);
//         setUser(JSON.parse(storedUser));
//       }
//     } catch (err) {
//       console.error('Failed to parse local authentication cache', err);
//       localStorage.removeItem('lumina_token');
//       localStorage.removeItem('lumina_user');
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Login handler
//   const login = async ({ email, password }) => {
//     try {
//       const response = await fetch(`${API_URL}/api/auth/login`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(result.message || 'Invalid email or password');
//       }

//       const { user: userData, token: jwtToken } = result.data;

//       // Update state
//       setUser(userData);
//       setToken(jwtToken);

//       // Persist to storage
//       localStorage.setItem('lumina_token', jwtToken);
//       localStorage.setItem('lumina_user', JSON.stringify(userData));

//       return { success: true, user: userData };
//     } catch (error) {
//       return { success: false, error: error.message || 'An unexpected error occurred' };
//     }
//   };

//   // Register / Signup handler
//   const register = async ({ fullName, email, password }) => {
//     try {
//       const response = await fetch(`${API_URL}/api/auth/register`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ fullName, email, password }),
//       });

//       const result = await response.json();

//       if (!response.ok || !result.success) {
//         throw new Error(result.message || 'Registration failed. Please try again.');
//       }

//       const { user: userData, token: jwtToken } = result.data;

//       // Update state
//       setUser(userData);
//       setToken(jwtToken);

//       // Persist to storage
//       localStorage.setItem('lumina_token', jwtToken);
//       localStorage.setItem('lumina_user', JSON.stringify(userData));

//       return { success: true, user: userData };
//     } catch (error) {
//       return { success: false, error: error.message || 'An unexpected error occurred' };
//     }
//   };

//   // Logout handler
//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('lumina_token');
//     localStorage.removeItem('lumina_user');
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     isAuthenticated: !!token,
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };