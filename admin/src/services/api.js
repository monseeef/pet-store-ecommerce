import axios from "axios";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:3300";

export const api = axios.create({
  baseURL: `${API_ROOT}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getApiError = (error) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  "Something went wrong";

export default api;
