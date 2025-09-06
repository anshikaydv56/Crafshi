import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// ✅ Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string, // .env file me VITE_BACKEND_URL define hona chahiye
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Please login again.");
      // Optionally redirect
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
