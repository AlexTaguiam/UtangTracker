import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Your backend URL
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
