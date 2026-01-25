import React from 'react';
import { Link } from 'react-router-dom';
import MarketplaceLayout from '../components/layouts/MarketplaceLayout';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
    const { wishlist, clearWishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <MarketplaceLayout>
                <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <div className="text-6xl mb-6">❤️</div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Your wishlist is empty</h1>
                    <p className="text-gray-500 mb-8 text-lg">Save items you like to see them here.</p>
                    <Link
                        to="/products"
                        className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition inline-block"
                    >
                        Explore Products
                    </Link>
                </div>
            </MarketplaceLayout>
        );
    }

    return (
        <MarketplaceLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <button
                        onClick={clearWishlist}
                        className="text-gray-500 hover:text-red-500 text-sm font-medium"
                    >
                        Clear All
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                        <ProductCard key={item.productId} product={item.product || item} />
                    ))}
                </div>
            </div>
        </MarketplaceLayout>
    );
};

export default Wishlist;
