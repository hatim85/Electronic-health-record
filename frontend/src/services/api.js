import axios from "axios";

// Base API URL (adjust according to your backend server)
const BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor → attach auth token if available
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("ehr-user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor → handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - logging out user");
      localStorage.removeItem("ehr-user");
      window.location.href = "/login"; // force redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
