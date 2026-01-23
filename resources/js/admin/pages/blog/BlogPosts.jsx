import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blog';
import BlogPostForm from './BlogPostForm';

export default function BlogPosts() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [currentPage, filterCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage };
      if (filterCategory) params.category_id = filterCategory;
      if (searchTerm) params.search = searchTerm;
      const response = await blogService.getPosts(params);
      setPosts(response.data || []);
    } catch (err) {
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await blogService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to fetch categories');
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Delete this post?')) {
      try {
        await blogService.deletePost(postId);
        setPosts(posts.filter(p => p.id !== postId));
      } catch (err) {
        setError('Failed to delete post');
      }
    }
  };

  const handlePostSaved = () => {
    setShowForm(false);
    setEditingPost(null);
    fetchPosts();
  };

  if (loading) return <div className="p-4">Loading blog posts...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <button
          onClick={() => {
            setEditingPost(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded border">
          <BlogPostForm
            post={editingPost}
            categories={categories}
            onSaved={handlePostSaved}
          />
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 px-4 py-2 border rounded"
        />
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Posts list */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="p-4 border rounded hover:shadow-md transition">
            <div className="flex justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{post.excerpt}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span className="mr-4">Category: {post.category?.name}</span>
                  <span className="mr-4">Author: {post.author?.name}</span>
                  <span className="mr-4">Status: {post.status}</span>
                  <span>Views: {post.views_count}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingPost(post);
                    setShowForm(true);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No blog posts found
        </div>
      )}
    </div>
  );
}
