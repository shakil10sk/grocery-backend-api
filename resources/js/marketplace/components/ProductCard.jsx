import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlisted(!isWishlisted);
    };

    // Determine badge based on product properties
    const getBadge = () => {
        if (product.is_featured) return { text: 'Best Seller', color: 'bg-amber-500' };
        if (product.is_new) return { text: 'New', color: 'bg-blue-500' };
        if (product.discount_price) return { text: 'Sale', color: 'bg-red-500' };
        if (product.id % 5 === 0) return { text: 'Fresh', color: 'bg-green-500' };
        if (product.id % 7 === 0) return { text: 'Local', color: 'bg-orange-500' };
        return null;
    };

    const badge = getBadge();

    // Helper for star ratings
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(rating || 0) ? 'text-amber-400 fill-current' : 'text-gray-200 fill-current'}`}
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <div className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 flex flex-col h-full relative">
            {/* Image Container */}
            <Link to={`/products/${product.id}`} className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                {product.thumbnail_url ? (
                    <img
                        src={product.thumbnail_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Badge */}
                {badge && (
                    <span className={`absolute top-4 left-4 z-10 ${badge.color} text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm`}>
                        {badge.text}
                    </span>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={toggleWishlist}
                    className={`absolute top-3 right-3 z-10 p-2 rounded-full shadow-sm backdrop-blur-md transition-all duration-300 ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-400'}`}
                >
                    <svg className={`w-5 h-5 ${isWishlisted ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </Link>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Vendor Info */}
                <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Sold by:</span>
                    <Link to={`/vendors/${product.vendor?.id}`} className="text-[11px] font-black text-blue-600 hover:text-blue-800 truncate flex items-center gap-1">
                        {product.vendor?.vendor_profile?.store_name || product.vendor?.name || 'Local Farm'}
                        {product.vendor?.vendor_profile?.is_verified && (
                            <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                            </svg>
                        )}
                    </Link>
                </div>


                <Link to={`/products/${product.id}`}>
                    <h3 className="text-lg font-extrabold text-gray-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                        {renderStars(product.average_rating)}
                    </div>
                    <span className="text-[11px] font-bold text-gray-400">({product.reviews_count || 0})</span>
                </div>

                {/* Price and Stock Info */}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-2xl font-black text-gray-900">
                            ${(product.discount_price || product.price).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 font-bold lowercase">
                            /${product.unit || 'unit'}
                        </span>
                    </div>

                    {product.discount_price && (
                        <p className="text-xs text-gray-400 line-through mb-1">
                            ${product.price.toFixed(2)}
                        </p>
                    )}

                    <div className="flex items-center gap-1.5 text-gray-500 mb-5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span className="text-[11px] font-bold">Ships within 24h</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg shadow-emerald-700/10 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
