import apiClient from '../utils/axios';

/**
 * Generic API service methods
 */
export const apiService = {
  /**
   * GET request
   */
  get: async (url, config = {}) => {
    const response = await apiClient.get(url, config);
    return response.data;
  },

  /**
   * POST request
   */
  post: async (url, data = {}, config = {}) => {
    const response = await apiClient.post(url, data, config);
    return response.data;
  },

  /**
   * PUT request
   */
  put: async (url, data = {}, config = {}) => {
    const response = await apiClient.put(url, data, config);
    return response.data;
  },

  /**
   * PATCH request
   */
  patch: async (url, data = {}, config = {}) => {
    const response = await apiClient.patch(url, data, config);
    return response.data;
  },

  /**
   * DELETE request
   */
  delete: async (url, config = {}) => {
    const response = await apiClient.delete(url, config);
    return response.data;
  },

  /**
   * POST request with FormData (for file uploads)
   */
  postFormData: async (url, formData, config = {}) => {
    const response = await apiClient.post(url, formData, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default apiService;

