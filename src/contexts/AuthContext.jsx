import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on load
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('access_token');
    
    if (storedUser && token) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        // Invalid stored user data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      if (response.data.access_token) {
        const { access_token, ...userData } = response.data;
        
        // Save to localStorage for persistence
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Update state
        setCurrentUser(userData);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      if (response.data.access_token) {
        const { access_token, ...newUserData } = response.data;
        
        // Save to localStorage for persistence
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('currentUser', JSON.stringify(newUserData));
        
        // Update state
        setCurrentUser(newUserData);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    
    // Clear state
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
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
