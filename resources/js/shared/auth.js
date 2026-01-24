import api from './api';

export const authService = {
  login: async (credentials) => {
    // const response = await api.post('/login', credentials);
    // if (response.data.token) {
    //   localStorage.setItem('token', response.data.token);
    //   api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    // }
    // return response.data;
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  register: async (userData) => {
    const response = await api.post('/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  getToken: () => localStorage.getItem('token'),

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },
};

// Initialize token on app load
const token = authService.getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default authService;
