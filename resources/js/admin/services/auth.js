import apiService from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

export const authService = {
  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await apiService.post(API_ENDPOINTS.LOGIN, credentials);
    
    if (response.success && response.data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await apiService.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  /**
   * Get authenticated user
   */
  getMe: async () => {
    return await apiService.get(API_ENDPOINTS.ME);
  },

  /**
   * Refresh token
   */
  refreshToken: async () => {
    const response = await apiService.post(API_ENDPOINTS.REFRESH);
    
    if (response.success && response.data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
    }
    
    return response;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Get stored user data
   */
  getStoredUser: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Get stored token
   */
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },
};

export default authService;

