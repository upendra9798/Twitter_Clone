// utils/makeRequest.js
import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;

const makeRequest = axios.create({
  baseURL,
  withCredentials: true, // 🔑 always send cookies/JWT
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
makeRequest.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url, config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
makeRequest.interceptors.response.use(
  (response) => {
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default makeRequest;
