import axios from "axios";

// Determine API base URL based on environment
// Only include the domain here, no trailing /api
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create Axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`, // append /api once
  withCredentials: true, // send cookies with requests
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Attach Authorization header automatically if token exists
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

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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
