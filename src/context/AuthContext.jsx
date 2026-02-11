import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Synchronous initialization from localStorage - state is ready on FIRST RENDER
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('access_token') || null;
  });

  const [loading, setLoading] = useState(false); // No loading needed since we sync init

  // Configure axios headers when token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verify token in background (only if we have a token)
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return;

      try {
        const response = await api.get('/auth/me');
        const freshUser = response.data;
        // Only update if user changed
        if (JSON.stringify(freshUser) !== JSON.stringify(currentUser)) {
          setCurrentUser(freshUser);
          localStorage.setItem('currentUser', JSON.stringify(freshUser));
        }
      } catch (error) {
        // Token invalid - clear auth
        console.log('Token verification failed, logging out');
        logout();
      }
    };

    verifyToken();
  }, []);

  /**
   * Login user with credentials
   * @param {Object} credentials - { email, password }
   * @returns {Object|null} - User data or null on failure
   */
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { access_token, user } = response.data;

      // Set token and user synchronously
      setToken(access_token);
      setCurrentUser(user);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      console.log('✅ Login successful:', user.email, '- Role:', user.role);
      return user;
    } catch (error) {
      console.error('❌ Login failed:', error.response?.data?.message || error.message);
      return null;
    }
  };

  /**
   * Register new user
   * @param {Object} userData - { email, password, fullName, role, ... }
   * @returns {Object} - { success: boolean, user?, error? }
   */
  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { access_token, user } = response.data;

      // Set token and user synchronously
      setToken(access_token);
      setCurrentUser(user);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      console.log('✅ Registration successful:', user.email);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Registration failed:', error.response?.data?.message || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  /**
   * Logout user and clear all auth state
   */
  const logout = () => {
    console.log('🚪 Logging out:', currentUser?.email);
    
    // Clear state
    setCurrentUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    
    // Axios headers are cleared by useEffect when token is null
  };

  /**
   * Update user profile data
   * @param {Object} userData - Updated user fields
   */
  const updateProfile = async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      const updatedUser = response.data;
      
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      console.log('✅ Profile updated');
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('❌ Profile update failed:', error.response?.data?.message || error.message);
      return {
        success: false,
        error: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  // Context value
  const value = {
    // State
    currentUser,
    token,
    loading,
    
    // Computed
    isAuthenticated: !!currentUser && !!token,
    
    // Methods
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
