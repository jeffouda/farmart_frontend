import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
=======
  // This now points to your permanent static ngrok domain
  baseURL: "https://aglisten-armida-confarreate.ngrok-free.dev/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
>>>>>>> origin
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
<<<<<<< HEAD
  (error) => {
    return Promise.reject(error);
  },
=======
  (error) => Promise.reject(error),
>>>>>>> origin
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
<<<<<<< HEAD
      // Token expired or invalid - Clear storage and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      // Redirect to auth page if not already there
=======
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
>>>>>>> origin
      if (!window.location.pathname.includes("/auth")) {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
