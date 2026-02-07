import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  // Start with loading = true to prevent false redirects
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('currentUser');

      // If no token exists, we're not authenticated - stop loading immediately
      if (!token) {
        setLoading(false);
        return;
      }

      // Token exists - restore saved user immediately
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }

      // Verify token and fetch fresh user data
      try {
        const response = await api.get('/auth/me');
        const freshUser = response.data;
        setCurrentUser(freshUser);
        localStorage.setItem('currentUser', JSON.stringify(freshUser));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Token is invalid or expired - clear auth
        localStorage.removeItem('access_token');
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
      }

      // Always stop loading after token check completes
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      const { access_token, user } = response.data;

      // Save to localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      setCurrentUser(user);
      return user;
    } catch (error) {
      setCurrentUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { access_token, user } = response.data;

      // Save to localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      setCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
