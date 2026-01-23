import { apiService } from './api';

// baseURL already contains /api/v1
const BLOG_API = 'blog';

export const blogService = {
  /**
   * Get all blog posts
   */
  getPosts: async (params = {}) => {
    return apiService.get(`${BLOG_API}/posts`, { params });
  },

  /**
   * Get single blog post
   */
  getPost: async (postId) => {
    return apiService.get(`${BLOG_API}/posts/${postId}`);
  },

  /**
   * Create blog post
   */
  createPost: async (data) => {
    return apiService.post(`${BLOG_API}/posts`, data);
  },

  /**
   * Update blog post
   */
  updatePost: async (postId, data) => {
    return apiService.put(`${BLOG_API}/posts/${postId}`, data);
  },

  /**
   * Delete blog post
   */
  deletePost: async (postId) => {
    return apiService.delete(`${BLOG_API}/posts/${postId}`);
  },

  /**
   * Get blog comments for a post
   */
  getPostComments: async (postId, params = {}) => {
    return apiService.get(`${BLOG_API}/posts/${postId}/comments`, { params });
  },

  /**
   * Add comment to blog post
   */
  addComment: async (postId, data) => {
    return apiService.post(`${BLOG_API}/posts/${postId}/comments`, data);
  },

  /**
   * Delete comment
   */
  deleteComment: async (commentId) => {
    return apiService.delete(`${BLOG_API}/comments/${commentId}`);
  },

  /**
   * Approve comment (admin only)
   */
  approveComment: async (commentId) => {
    return apiService.post(`${BLOG_API}/comments/${commentId}/approve`);
  },

  /**
   * Get all blog categories
   */
  getCategories: async (params = {}) => {
    return apiService.get(`${BLOG_API}/categories`, { params });
  },

  /**
   * Create blog category
   */
  createCategory: async (data) => {
    return apiService.post(`${BLOG_API}/categories`, data);
  },

  /**
   * Update blog category
   */
  updateCategory: async (categoryId, data) => {
    return apiService.put(`${BLOG_API}/categories/${categoryId}`, data);
  },

  /**
   * Delete blog category
   */
  deleteCategory: async (categoryId) => {
    return apiService.delete(`${BLOG_API}/categories/${categoryId}`);
  },
};
