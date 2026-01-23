import apiService from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const categoryService = {
  /**
   * Get all categories
   */
  getCategories: async (params = {}) => {
    return await apiService.get(API_ENDPOINTS.CATEGORIES, { params });
  },

  /**
   * Get single category
   */
  getCategory: async (id) => {
    return await apiService.get(API_ENDPOINTS.CATEGORY(id));
  },

  /**
   * Create category (Admin only)
   */
  createCategory: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'image' && data[key] instanceof File) {
        formData.append('image', data[key]);
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    return await apiService.postFormData(API_ENDPOINTS.CATEGORIES, formData);
  },

  /**
   * Update category (Admin only)
   */
  updateCategory: async (id, data) => {
    // Check if there's a file upload
    const hasFile = data.image && data.image instanceof File;

    if (hasFile) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'image' && data[key] instanceof File) {
          formData.append('image', data[key]);
        } else if (data[key] !== null && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });
      return await apiService.put(API_ENDPOINTS.CATEGORY(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // Regular JSON update
      return await apiService.put(API_ENDPOINTS.CATEGORY(id), data);
    }
  },

  /**
   * Delete category (Admin only)
   */
  deleteCategory: async (id) => {
    return await apiService.delete(API_ENDPOINTS.CATEGORY(id));
  },

  /**
   * Toggle category status (Admin only)
   */
  toggleStatus: async (id) => {
    return await apiService.post(API_ENDPOINTS.CATEGORY_TOGGLE_STATUS(id));
  },
};

export default categoryService;

