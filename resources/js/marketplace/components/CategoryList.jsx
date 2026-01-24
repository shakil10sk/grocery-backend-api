import React from 'react';
import { Link } from 'react-router-dom';

const CategoryList = ({ categories, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-100 h-32 rounded-lg animate-pulse"></div>
                ))}
            </div>
        );
    }

    if (!categories || categories.length === 0) return null;

    return (
        <div className="py-8">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
                <Link to="/products" className="text-green-600 hover:text-green-700 font-medium text-sm">View All &rarr;</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/products?category=${category.slug || category.id}`}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-4 flex flex-col items-center justify-center transition-all duration-300 text-center text-gray-700 hover:text-green-600 hover:border-green-500"
                    >
                        <div className="w-16 h-16 bg-gray-50 rounded-full mb-3 overflow-hidden group-hover:scale-110 transition-transform">
                            {/* Use icon or image if available, else generic icon */}
                            {category.icon_url || category.image_url ? (
                                <img src={category.icon_url || category.image_url} alt={category.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                </div>
                            )}
                        </div>
                        <span className="font-semibold text-sm">{category.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;
