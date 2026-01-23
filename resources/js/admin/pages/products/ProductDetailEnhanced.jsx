import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../../services/products';
import { reviewService } from '../../services/reviews';

import ProductImageUpload from '../../components/ProductImageUpload';

export default function ProductDetailEnhanced() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('details');
  const [imagesUpdated, setImagesUpdated] = useState(0);

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
  });

  const { data: reviewsData } = useQuery({
    queryKey: ['product-reviews', id],
    queryFn: () => reviewService.getProductReviews(id),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: () => productService.approveProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['product', id]);
      queryClient.invalidateQueries(['products']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      navigate('/products');
    },
  });

  const handleApprove = () => {
    if (window.confirm('Approve this product?')) {
      approveMutation.mutate();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Delete this product?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading product details...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error loading product</div>;
  }

  const product = productData?.data;
  if (!product) {
    return <div className="p-6">Product not found</div>;
  }

  const reviews = reviewsData?.data || [];
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600 mt-1">SKU: {product.sku}</p>
        </div>
        <div className="flex gap-2">
          {product.status === 'pending' && (
            <button
              onClick={handleApprove}
              disabled={approveMutation.isLoading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {approveMutation.isLoading ? 'Approving...' : 'Approve'}
            </button>
          )}
          <button
            onClick={() => navigate(`/products/${id}/edit`)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Delete
          </button>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>

      {/* Product Images and Video */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-lg border p-6">
        {/* Primary Image */}
        <div>
          <h3 className="font-bold mb-2">Product Image</h3>
          {product.images?.find(img => img.is_primary)?.image_url ? (
            <img
              src={product.images.find(img => img.is_primary).image_url}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
              No image
            </div>
          )}
        </div>

        {/* Video */}
        <div>
          <h3 className="font-bold mb-2">Product Video</h3>
          {product.video_url ? (
            <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
              <a
                href={product.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Watch Video →
              </a>
            </div>
          ) : (
            <div className="aspect-video bg-gray-200 rounded flex items-center justify-center text-gray-600">
              No video
            </div>
          )}
        </div>

        {/* Additional Images */}
        <div>
          <h3 className="font-bold mb-2">Other Images ({product.images?.filter(img => !img.is_primary).length || 0})</h3>
          <div className="grid grid-cols-2 gap-2">
            {product.images?.filter(img => !img.is_primary).map(img => (
              <img
                key={img.id}
                src={img.image_url}
                alt="Product"
                className="w-full h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-0">
          {['details', 'pricing', 'images', 'reviews'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'reviews' && reviews.length > 0 && ` (${reviews.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <div>
            <h3 className="font-bold text-gray-700">Description</h3>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-700">Short Description</h3>
            <p className="text-gray-600 mt-2">{product.short_description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-gray-700">Category</h3>
              <p className="text-gray-600 mt-2">{product.category?.name}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">Status</h3>
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium mt-2 ${
                product.status === 'approved'
                  ? 'bg-green-100 text-green-700'
                  : product.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {product.status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="font-bold text-gray-700">Weight</h3>
              <p className="text-gray-600 mt-2">{product.weight || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">Unit</h3>
              <p className="text-gray-600 mt-2">{product.unit}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">Featured</h3>
              <p className="text-gray-600 mt-2">{product.is_featured ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Images Tab */}
      {activeTab === 'images' && (
        <div className="bg-white rounded-lg border p-6">
          <ProductImageUpload 
            productId={id} 
            onImagesUpdated={() => setImagesUpdated(prev => prev + 1)}
          />
        </div>
      )}

      {/* Pricing Tab */}
      {activeTab === 'pricing' && (
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-bold text-gray-700">Price</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">₹{product.price}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">Compare at Price</h3>
              <p className="text-2xl font-bold text-gray-400 mt-2">
                {product.compare_at_price ? `₹${product.compare_at_price}` : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">Stock Quantity</h3>
              <p className={`text-lg font-semibold mt-2 ${
                product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock_quantity} items
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-700">Discount</h3>
              <p className="text-lg font-semibold text-orange-600 mt-2">
                {product.compare_at_price && product.price < product.compare_at_price
                  ? `${Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}%`
                  : 'No discount'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {/* Review Summary */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-5xl font-bold text-yellow-500">{averageRating}</div>
                  <div className="text-sm text-gray-600">Out of 5</div>
                  <div className="text-sm text-gray-600">{reviews.length} reviews</div>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = reviews.filter(r => r.rating === rating).length;
                    const percentage = (count / reviews.length) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Individual Reviews */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="bg-white rounded-lg border p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{review.user?.name}</h4>
                      <div className="text-yellow-500 text-sm">
                        {'⭐'.repeat(review.rating)}
                      </div>
                      <h5 className="font-semibold mt-1">{review.title}</h5>
                      <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        {review.is_verified_purchase && (
                          <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded mr-2">
                            Verified Purchase
                          </span>
                        )}
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded text-sm ${
                      review.is_approved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No reviews yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
