import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.origin}/api/v1`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add CSRF token to requests
api.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.content;
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - only redirect if not already on login page
      // This allows public pages to load without redirecting
      localStorage.removeItem('token');
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
        // Only redirect if accessing protected resources
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
