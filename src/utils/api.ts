import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// টোকেন অটোমেটিক পাঠানোর জন্য (Interceptors)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // ব্রাউজার থেকে টোকেন নেবে
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;