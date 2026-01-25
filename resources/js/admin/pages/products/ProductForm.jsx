import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../../services/products';
import ProductImageUpload from '../../components/ProductImageUpload';
import categoryService from '../../services/categories';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    category_id: '',
    price: '',
    compare_at_price: '',
    stock_quantity: '',
    sku: '',
    weight: '',
    unit: 'piece',
    video_url: '',
    is_featured: false,
    allow_reviews: false,
  });
  const [errors, setErrors] = useState({});

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: isEditing,
  });

  useEffect(() => {
    if (isEditing && productData?.data) {
      const product = productData.data;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        short_description: product.short_description || '',
        category_id: product.category_id || '',
        price: product.price || '',
        compare_at_price: product.compare_at_price || '',
        stock_quantity: product.stock_quantity || '',
        sku: product.sku || '',
        weight: product.weight || '',
        unit: product.unit || 'piece',
        video_url: product.video_url || '',
        is_featured: product.is_featured || false,
        allow_reviews: product.meta?.allow_reviews || false,
      });
    }
  }, [isEditing, productData]);

  const createMutation = useMutation({
    mutationFn: (data) => productService.createProduct(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries(['products']);
      // Navigate to edit page of the newly created product so images can be uploaded
      const newId = response?.data?.id || response?.id;
      if (newId) {
        navigate(`/products/${newId}/edit`);
      } else {
        navigate('/products');
      }
    },
    onError: (error) => {
      console.error('Create product error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['product', id]);
      navigate('/products');
    },
    onError: (error) => {
      console.error('Update product error:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
      stock_quantity: parseInt(formData.stock_quantity),
      weight: formData.weight ? parseFloat(formData.weight) : null,
      meta: {
        ...(formData.meta || {}),
        allow_reviews: !!formData.allow_reviews,
      },
    };

    if (isEditing) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const categories = categoriesData?.data || [];

  if (isEditing && productLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update product information' : 'Create a new product for your store'}
          </p>
        </div>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description
            </label>
            <textarea
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.category_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU
            </label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compare at Price
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.compare_at_price}
              onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.compare_at_price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.compare_at_price && <p className="text-red-500 text-xs mt-1">{errors.compare_at_price[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.stock_quantity ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.stock_quantity && <p className="text-red-500 text-xs mt-1">{errors.stock_quantity[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unit
            </label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="piece">Piece</option>
              <option value="kg">Kilogram</option>
              <option value="g">Gram</option>
              <option value="lb">Pound</option>
              <option value="oz">Ounce</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL (YouTube, Vimeo, etc.)
            </label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://youtube.com/watch?v=..."
            />
            {formData.video_url && (
              <p className="text-sm text-gray-500 mt-2">Video URL: {formData.video_url}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Product</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.allow_reviews}
                onChange={(e) => setFormData({ ...formData, allow_reviews: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Allow Reviews</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">Enable customer reviews for this product (stored in product metadata).</p>
          </div>
        </div>

        {/* Image uploader: available when editing an existing product */}
        {isEditing && (
          <div className="mt-6">
            <ProductImageUpload productId={id} onImagesUpdated={() => queryClient.invalidateQueries(['product', id])} />
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isLoading || updateMutation.isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {createMutation.isLoading || updateMutation.isLoading
              ? 'Saving...'
              : isEditing
                ? 'Update Product'
                : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
