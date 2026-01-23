import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blog';

export default function BlogPostForm({ post, categories, onSaved }) {
  const [formData, setFormData] = useState({
    blog_category_id: '',
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    featured_image: null,
    meta: {},
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (post) {
      setFormData({
        blog_category_id: post.blog_category_id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status,
        featured_image: null,
        meta: post.meta || {},
      });
      if (post.featured_image) {
        setImagePreview(post.featured_image);
      }
    }
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        featured_image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('blog_category_id', formData.blog_category_id);
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('excerpt', formData.excerpt);
      data.append('status', formData.status);
      if (formData.featured_image) {
        data.append('featured_image', formData.featured_image);
      }
      if (Object.keys(formData.meta).length > 0) {
        data.append('meta', JSON.stringify(formData.meta));
      }

      if (post) {
        await blogService.updatePost(post.id, data);
      } else {
        await blogService.createPost(data);
      }

      setFormData({
        blog_category_id: '',
        title: '',
        content: '',
        excerpt: '',
        status: 'draft',
        featured_image: null,
        meta: {},
      });
      setImagePreview(null);
      onSaved();
    } catch (err) {
      setError(err.message || 'Failed to save blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          name="blog_category_id"
          value={formData.blog_category_id}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border rounded"
          placeholder="Post title"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium mb-1">Excerpt</label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          rows="2"
          className="w-full px-4 py-2 border rounded"
          placeholder="Short description"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          rows="8"
          className="w-full px-4 py-2 border rounded font-mono text-sm"
          placeholder="Write your blog post content here..."
        />
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium mb-1">Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border rounded"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 max-w-xs max-h-48"
          />
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
      </button>
    </form>
  );
}
