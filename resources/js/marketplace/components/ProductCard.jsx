import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };
    return (
        <Link
            to={`/products/${product.id}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
        >
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {product.thumbnail_url ? (
                    <img
                        src={product.thumbnail_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
                {/* Badge example: Sale or New */}
                {product.is_new && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                        NEW
                    </span>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-2">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem] group-hover:text-green-600 transition-colors">
                        {product.name}
                    </h3>
                    {product.category && (
                        <p className="text-xs text-gray-500 mt-1">{product.category.name}</p>
                    )}
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div>
                        {product.discount_price ? (
                            <div className="flex flex-col">
                                <span className="text-gray-400 text-xs line-through">${product.price}</span>
                                <span className="text-lg font-bold text-green-600">${product.discount_price}</span>
                            </div>
                        ) : (
                            <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="bg-gray-100 hover:bg-green-600 hover:text-white text-gray-600 p-2 rounded-full transition-colors"
                        title="Add to Cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
