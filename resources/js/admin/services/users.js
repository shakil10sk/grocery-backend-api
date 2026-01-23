import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const userService = {
  /**
   * Get all users
   */
  getUsers: async (params = {}) => {
    return await apiService.get(API_ENDPOINTS.USERS, { params });
  },

  /**
   * Get single user
   */
  getUser: async (id) => {
    return await apiService.get(API_ENDPOINTS.USER(id));
  },

  /**
   * Update user
   */
  updateUser: async (id, data) => {
    return await apiService.put(API_ENDPOINTS.USER(id), data);
  },

  /**
   * Delete user
   */
  deleteUser: async (id) => {
    return await apiService.delete(API_ENDPOINTS.USER(id));
  },
};

export default userService;

