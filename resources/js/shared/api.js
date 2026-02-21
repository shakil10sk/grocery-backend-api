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

// Add token to requests
api.interceptors.request.use((config) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }

  let token = localStorage.getItem('token');
  if (token) {
    // If token is stored as a JSON string (with quotes), parse it
    if (token.startsWith('"') && token.endsWith('"')) {
      try {
        token = JSON.parse(token);
      } catch (e) {
        // Fallback to original token if parsing fails
      }
    }
    config.headers['Authorization'] = `Bearer ${token}`;
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
      localStorage.removeItem('user');
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
