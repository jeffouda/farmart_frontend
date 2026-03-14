import axios from "axios";

// IMPORTANT: base URL should include /api prefix
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`, // ✅ Include /api prefix
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Attach JWT if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle auth expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth data
      localStorage.removeItem("access_token");
      localStorage.removeItem("currentUser");

      // Only redirect if not already on auth page
      if (!window.location.pathname.includes("/auth") && 
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/signup")) {
        console.log('🔒 Session expired, redirecting to login');
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
