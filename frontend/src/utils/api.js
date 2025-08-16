import axios from "axios";

const baseURL = import.meta.env.PROD
  ? "https://twitter-clone-27ho.onrender.com/api" // ✅ Render backend in production
  : "/api"; // ✅ vite proxy for dev

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
      data: options.body || undefined, // only send body if needed
      withCredentials: true, // 🔑 needed for cookies/JWT
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response || error.message);

    // Pass along backend error message if available
    throw new Error(
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong"
    );
  }
};
