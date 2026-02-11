import axios from "axios";

// Create axios instance with base URL - use relative path for Vite proxy
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - Clear storage and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      // Redirect to auth page if not already there
      if (!window.location.pathname.includes("/auth")) {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
