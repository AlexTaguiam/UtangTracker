import axios from "axios";
import { auth } from "../config/firebase.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - adds token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error in getting token:", error);
    }
  }
  return config;
});

// The "Magic" Interceptor
api.interceptors.response.use(
  (response) => {
    // If the backend used our new sendResponse helper:
    // We return response.data.data so your components
    // get the clean object/array directly.
    return response.data.success ? response.data.data : response;
  },
  (error) => {
    // Centralized Error Handling:
    // You can trigger a Toast notification here using error.response.data.message
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    console.error("API Error:", errorMessage);
    return Promise.reject(errorMessage);
  },
);

export default api;
