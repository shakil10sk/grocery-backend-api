import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import productService from '../../services/products';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', page, statusFilter, search],
    queryFn: () => productService.getProducts({
      page,
      per_page: 20,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: search || undefined,
    }),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => productService.approveProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => productService.rejectProduct(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchParams({ search, status: statusFilter, page: '1' });
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setPage(1);
    setSearchParams({ search, status, page: '1' });
  };

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this product?')) {
      await approveMutation.mutateAsync(id);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason) {
      await rejectMutation.mutateAsync({ id, reason });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const products = data?.data || [];
  const pagination = data?.pagination || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading products. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage all products in your store</p>
        </div>
        <button
          onClick={() => navigate('/products/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {product.images && product.images.length > 0 ? (
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.images.find(img => img.is_primary)?.image_path || product.images[0]?.image_path}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                    {product.name}
                  </h3>
                  <span
                    className={`ml-2 px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${
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
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.short_description || product.description}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ${parseFloat(product.price || 0).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock_quantity || 0}
                  </span>
                </div>
                <div className="flex gap-2">
                  {product.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(product.id)}
                        className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(product.id)}
                        className="flex-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-1.5 text-red-600 text-sm rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              setSearchParams({ search, status: statusFilter, page: String(Math.max(1, page - 1)) });
            }}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {pagination.current_page} of {pagination.last_page}
          </span>
          <button
            onClick={() => {
              setPage((p) => Math.min(pagination.last_page, p + 1));
              setSearchParams({ search, status: statusFilter, page: String(Math.min(pagination.last_page, page + 1)) });
            }}
            disabled={page === pagination.last_page}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
