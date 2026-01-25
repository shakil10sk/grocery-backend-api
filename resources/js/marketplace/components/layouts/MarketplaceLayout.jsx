import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const MarketplaceLayout = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const { cart } = useCart();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-green-600">Grosarry</Link>
                    <div className="flex gap-6 items-center">
                        <Link to="/" className="font-medium hover:text-green-600">Home</Link>
                        <Link to="/products" className="font-medium hover:text-green-600">Shop</Link>
                        <Link to="/vendors" className="font-medium hover:text-green-600">Vendors</Link>
                        <Link to="/cart" className="relative text-gray-600 hover:text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {cart.items.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {cart.items.length}
                                </span>
                            )}
                        </Link>
                        {isAuthenticated ? (
                            <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs uppercase">
                                    {user?.name?.charAt(0)}
                                </span>
                                <span className="font-medium text-sm hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <Link to="/login" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition">
                                Login
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-white border-t border-gray-200 mt-12 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                    &copy; {new Date().getFullYear()} Grosarry. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default MarketplaceLayout;
