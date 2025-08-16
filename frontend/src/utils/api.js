// utils/makeRequest.js
import axios from "axios";

const baseURL = import.meta.env.PROD
  ? "https://twitter-clone-27ho.onrender.com/api" // backend prod
  : "/api"; // vite proxy in dev

const makeRequest = axios.create({
  baseURL,
  withCredentials: true, // 🔑 always send cookies/JWT
  headers: {
    "Content-Type": "application/json",
  },
});

export default makeRequest;
