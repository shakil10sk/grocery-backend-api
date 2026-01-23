import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blog';

export default function BlogCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
    sort_order: 0,
    is_active: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await blogService.getCategories();
      setCategories(response.data || []);
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
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
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('sort_order', formData.sort_order);
      data.append('is_active', formData.is_active);
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingCategory) {
        await blogService.updateCategory(editingCategory.id, data);
        setCategories(categories.map(c =>
          c.id === editingCategory.id
            ? { ...c, ...Object.fromEntries(data) }
            : c
        ));
      } else {
        const response = await blogService.createCategory(data);
        setCategories([...categories, response.data]);
      }

      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Delete this category?')) {
      try {
        await blogService.deleteCategory(categoryId);
        setCategories(categories.filter(c => c.id !== categoryId));
      } catch (err) {
        setError('Failed to delete category');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: null,
      sort_order: 0,
      is_active: true,
    });
    setImagePreview(null);
    setEditingCategory(null);
    setShowForm(false);
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      image: null,
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    if (category.image) {
      setImagePreview(category.image);
    }
    setShowForm(true);
  };

  if (loading && categories.length === 0) {
    return <div className="p-4">Loading categories...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Categories</h2>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'New Category'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded"
                placeholder="Category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-4 py-2 border rounded"
                placeholder="Category description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
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
                  className="mt-2 max-w-xs max-h-32"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Sort Order</label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      {/* Categories grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div
            key={category.id}
            className="p-4 border rounded hover:shadow-md transition"
          >
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-bold text-lg">{category.name}</h3>
            <p className="text-gray-600 text-sm mt-1">{category.description}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => startEdit(category)}
                className="flex-1 text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="flex-1 text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-500">
          No categories found
        </div>
      )}
    </div>
  );
}
