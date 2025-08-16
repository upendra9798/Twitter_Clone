import axios from "axios";

const baseURL = import.meta.env.PROD
  ? "https://twitter-clone-27ho.onrender.com/api" // ✅ backend in production
  : "/api"; // ✅ vite proxy in dev

export const makeRequest = async (endpoint, options = {}) => {
  const url = `${baseURL}${endpoint}`;

  try {
    const response = await axios({
      method: options.method || "GET",
      url,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      data: options.data || options.body || undefined, 
      // ✅ support both //data used when using axios directly
      //body used when using fetch
      withCredentials: true, // 🔑 include cookies/JWT
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response || error.message);

    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong"
    );
  }
};
