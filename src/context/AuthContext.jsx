import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// Custom hook for easy access to auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("access_token") || null;
  });

  const [loading, setLoading] = useState(false);

  // Sync Axios headers whenever token changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Verify token whenever it changes
  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      setLoading(true);
      try {
        const response = await api.get("/auth/me");
        const freshUser = response.data;

        // Only update if user data changed
        if (JSON.stringify(freshUser) !== JSON.stringify(currentUser)) {
          setCurrentUser(freshUser);
          localStorage.setItem("currentUser", JSON.stringify(freshUser));
        }
      } catch (error) {
        console.log("Token verification failed, logging out");
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]); // <-- run when token changes

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Object|null} - User data or null
   */
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", credentials);
      const { access_token, user } = response.data;

      // Save token and user
      setToken(access_token);
      setCurrentUser(user);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      console.log("✅ Login successful:", user.email, "- Role:", user.role);
      return user;
    } catch (error) {
      console.error(
        "❌ Login failed:",
        error.response?.data?.message || error.message,
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register user
   * @param {Object} userData
   * @returns {Object} - { success, user?, error? }
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", userData);
      const { access_token, user } = response.data;

      // Save token and user
      setToken(access_token);
      setCurrentUser(user);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      console.log("✅ Registration successful:", user.email);
      return { success: true, user };
    } catch (error) {
      console.error(
        "❌ Registration failed:",
        error.response?.data?.message || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    console.log("🚪 Logging out:", currentUser?.email);
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("currentUser");
    // Axios headers are cleared by useEffect
  };

  /**
   * Update user profile
   * @param {Object} userData
   */
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const response = await api.put("/auth/profile", userData);
      const updatedUser = response.data;

      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      console.log("✅ Profile updated");
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error(
        "❌ Profile update failed:",
        error.response?.data?.message || error.message,
      );
      return {
        success: false,
        error: error.response?.data?.message || "Profile update failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    currentUser,
    setCurrentUser,
    token,
    loading,
    isAuthenticated: !!currentUser && !!token,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
