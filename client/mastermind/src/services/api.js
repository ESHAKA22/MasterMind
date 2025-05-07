import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle specific error codes
    if (response && response.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access");
    } else if (response && response.status === 404) {
      // Handle not found
      console.error("Resource not found");
    } else if (response && response.status >= 500) {
      // Handle server errors
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

export default api;
