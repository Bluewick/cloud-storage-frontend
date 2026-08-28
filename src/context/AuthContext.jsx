import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5783';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('lumina_token');
      const storedUser = localStorage.getItem('lumina_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to parse local authentication cache', err);
      localStorage.removeItem('lumina_token');
      localStorage.removeItem('lumina_user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Login handler
  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Invalid email or password');
      }

      const { user: userData, token: jwtToken } = result.data;

      // Update state
      setUser(userData);
      setToken(jwtToken);

      // Persist to storage
      localStorage.setItem('lumina_token', jwtToken);
      localStorage.setItem('lumina_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  // Register / Signup handler
  const register = async ({ fullName, email, password }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed. Please try again.');
      }

      const { user: userData, token: jwtToken } = result.data;

      // Update state
      setUser(userData);
      setToken(jwtToken);

      // Persist to storage
      localStorage.setItem('lumina_token', jwtToken);
      localStorage.setItem('lumina_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lumina_token');
    localStorage.removeItem('lumina_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};