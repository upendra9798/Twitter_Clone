const baseURL = import.meta.env.PROD 
  ? 'https://twitter-clone-27ho.onrender.com'
  : '/api';

export const makeRequest = async (endpoint, options = {}) => {
  const url = `${baseURL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  
  return data;
};
