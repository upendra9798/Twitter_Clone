// utils/makeRequest.js
import axios from "axios";

const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api`;

const makeRequest = axios.create({
  baseURL,
  withCredentials: true, // 🔑 always send cookies/JWT
  headers: {
    "Content-Type": "application/json",
  },
});

export default makeRequest;
