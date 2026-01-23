import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../../services/products';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
  });

  const approveMutation = useMutation({
    mutationFn: () => productService.approveProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['product', id]);
      queryClient.invalidateQueries(['products']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (reason) => productService.rejectProduct(id, reason),
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
    if (window.confirm('Are you sure you want to approve this product?')) {
      approveMutation.mutate();
    }
  };

  const handleReject = () => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason) {
      rejectMutation.mutate(reason);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Product not found or error loading product.
      </div>
    );
  }

  const product = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/products')}
            className="text-blue-600 hover:text-blue-700 mb-2 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 mt-1">Product details and management</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/products/${id}/edit`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
          {product.status === 'pending' && (
            <>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {product.images && product.images.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images.map((image) => (
                  <div key={image.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={image.image_path}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {product.description || product.short_description || 'No description available'}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Status</span>
                <div className="mt-1">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                      product.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : product.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Active</span>
                <div className="mt-1">
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                      product.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {product.is_active ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Price</span>
                <p className="text-lg font-semibold text-gray-900">${parseFloat(product.price || 0).toFixed(2)}</p>
                {product.compare_at_price && (
                  <p className="text-sm text-gray-500 line-through">
                    ${parseFloat(product.compare_at_price).toFixed(2)}
                  </p>
                )}
              </div>
              <div>
                <span className="text-sm text-gray-600">Stock Quantity</span>
                <p className="text-lg font-semibold text-gray-900">{product.stock_quantity || 0}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">SKU</span>
                <p className="text-lg font-semibold text-gray-900">{product.sku || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Category</span>
                <p className="text-lg font-semibold text-gray-900">
                  {product.category?.name || 'Uncategorized'}
                </p>
              </div>
              {product.vendor && (
                <div>
                  <span className="text-sm text-gray-600">Vendor</span>
                  <p className="text-lg font-semibold text-gray-900">{product.vendor.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
