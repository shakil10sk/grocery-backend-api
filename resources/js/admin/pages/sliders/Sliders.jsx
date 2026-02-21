import React, { useState, useEffect } from 'react';
import { sliderService } from '../../services/sliders';

export default function SlidersManagement() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    link_text: 'Shop Now',
    order: 0,
    is_active: true,
    start_date: '',
    end_date: '',
    button_color: '#10b981',
    text_overlay_color: '#ffffff',
    overlay_opacity: '30',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sliderService.getAllSliders();
      setSliders(response.data.data || response.data || []);
    } catch (err) {
      setError('Failed to fetch sliders');
      console.error(err);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setUploadingImage(true);
      setError(null);
      const response = await sliderService.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        image_url: response.data.image_url,
      }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to upload image: ' + (err.response?.data?.message || err.message));
      setImagePreview(null);
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      link_url: '',
      link_text: 'Shop Now',
      order: 0,
      is_active: true,
      start_date: '',
      end_date: '',
      button_color: '#10b981',
      text_overlay_color: '#ffffff',
      overlay_opacity: '30',
    });
    setEditingSlider(null);
    setShowForm(false);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image_url.trim()) {
      alert('Title and Image URL are required');
      return;
    }

    try {
      setLoading(true);
      if (editingSlider) {
        await sliderService.updateSlider(editingSlider.id, formData);
        setSuccess(true);
      } else {
        await sliderService.createSlider(formData);
        setSuccess(true);
      }
      fetchSliders();
      resetForm();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(editingSlider ? 'Failed to update slider' : 'Failed to create slider');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      description: slider.description || '',
      image_url: slider.image_url,
      link_url: slider.link_url || '',
      link_text: slider.link_text || 'Shop Now',
      order: slider.order,
      is_active: slider.is_active,
      start_date: slider.start_date ? slider.start_date.split('T')[0] : '',
      end_date: slider.end_date ? slider.end_date.split('T')[0] : '',
      button_color: slider.button_color || '#10b981',
      text_overlay_color: slider.text_overlay_color || '#ffffff',
      overlay_opacity: slider.overlay_opacity || '30',
    });
    setImagePreview(slider.image_url);
    setShowForm(true);
  };

  const handleDelete = async (sliderId) => {
    if (!window.confirm('Are you sure you want to delete this slider?')) return;

    try {
      setLoading(true);
      await sliderService.deleteSlider(sliderId);
      setSuccess(true);
      fetchSliders();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to delete slider');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (sliderId) => {
    try {
      setLoading(true);
      await sliderService.toggleSlider(sliderId);
      fetchSliders();
    } catch (err) {
      setError('Failed to toggle slider');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && sliders.length === 0) {
    return <div className="p-4">Loading sliders...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Slider Management</h2>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : '+ Add New Slider'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Operation completed successfully!
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold mb-4">
            {editingSlider ? 'Edit Slider' : 'Create New Slider'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Slider title"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Slider Image *</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="flex-1 px-4 py-2 border rounded"
                    />
                    {uploadingImage && (
                      <span className="px-4 py-2 text-sm text-gray-600">Uploading...</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Or enter image URL manually:
                  </div>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Slider description (optional)"
                  rows="2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link URL</label>
                <input
                  type="url"
                  name="link_url"
                  value={formData.link_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Link Text</label>
                <input
                  type="text"
                  name="link_text"
                  value={formData.link_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="Shop Now"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order</label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button Color</label>
                <input
                  type="color"
                  name="button_color"
                  value={formData.button_color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input
                  type="color"
                  name="text_overlay_color"
                  value={formData.text_overlay_color}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Overlay Opacity (0-100)</label>
                <input
                  type="number"
                  name="overlay_opacity"
                  value={formData.overlay_opacity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
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
                  <span className="text-sm font-medium">Active</span>
                </label>
              </div>
            </div>

            {(imagePreview || formData.image_url) && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <img
                  src={imagePreview || formData.image_url}
                  alt="Preview"
                  className="max-w-md h-48 object-cover rounded border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingSlider ? 'Update Slider' : 'Create Slider'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sliders List */}
      {sliders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No sliders yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Order</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Valid</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sliders.map((slider) => (
                <tr key={slider.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div>
                      <p className="font-medium">{slider.title}</p>
                      <p className="text-sm text-gray-600">{slider.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3">{slider.order}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        slider.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {slider.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        slider.is_valid
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {slider.is_valid ? 'Valid' : 'Expired'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleToggle(slider.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {slider.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(slider)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slider.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
