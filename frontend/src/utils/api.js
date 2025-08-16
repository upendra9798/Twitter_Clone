import axios from 'axios';

const baseURL = import.meta.env.PROD 
  ? 'https://twitter-clone-27ho.onrender.com/api'
  : '/api';

export const makeRequest = async (endpoint, options = {}) => {
  const url = `${baseURL}${endpoint}`;
  try {
    const response = await axios({
      method: options.method || 'GET',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      data: options.body, // For POST, PUT, PATCH
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Something went wrong');
  }
};
