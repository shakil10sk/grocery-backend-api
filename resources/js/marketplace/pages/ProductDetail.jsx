import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/shared/api';
import MarketplaceLayout from '../components/layouts/MarketplaceLayout';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = product && wishlist.some(item => item.productId === product.id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        const productData = response.data.data || response.data;

        if (productData && typeof productData === 'object' && productData.id) {
          setProduct(productData);
          setSelectedImage(productData.thumbnail_url || (productData.images && productData.images[0]?.image_path));
        } else {
          throw new Error('Invalid product data');
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Product not found or an error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <MarketplaceLayout>
        <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </MarketplaceLayout>
    );
  }

  if (error || !product) {
    return (
      <MarketplaceLayout>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800">{error || 'Product not found'}</h2>
          <Link to="/products" className="mt-4 inline-block text-green-600 hover:underline">Back to Shop</Link>
        </div>
      </MarketplaceLayout>
    );
  }

  return (
    <MarketplaceLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm text-gray-500">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-green-600">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img.image_path)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img.image_path ? 'border-green-600 shadow-sm' : 'border-transparent hover:border-gray-200'
                      }`}
                  >
                    <img src={img.image_path} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              {product.category && (
                <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-xl">
                        {i < Math.floor(product.average_rating || 0) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({product.average_rating || '0.0'} / 5.0)</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-green-600 font-medium">{product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}</span>
              </div>
            </div>

            <div className="mb-8">
              {product.discount_price ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-green-600">${product.discount_price}</span>
                  <span className="text-xl text-gray-400 line-through">${product.price}</span>
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                    {Math.round((1 - product.discount_price / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description || 'No description available for this product. Fresh and high-quality grocery item delivered to your doorstep.'}
            </p>

            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-12">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition h-full border-r border-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center focus:outline-none font-bold"
                  />
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition h-full border-l border-gray-300"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-grow bg-green-600 text-white rounded-lg px-8 py-3 font-bold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed h-12 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Add to Cart
                </button>
              </div>

              <button
                onClick={toggleWishlist}
                className={`flex items-center gap-2 transition font-medium ${isWishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Vendor Info */}
            {product.vendor && (
              <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full border border-gray-200 flex items-center justify-center font-bold text-green-600">
                    {product.vendor.name?.charAt(0) || 'V'}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Sold by</p>
                    <h4 className="font-bold text-gray-900">{product.vendor.name}</h4>
                  </div>
                </div>
                <Link
                  to={`/vendors/${product.vendor.id}`}
                  className="text-green-600 font-medium hover:underline text-sm"
                >
                  Visit Store
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default ProductDetail;
