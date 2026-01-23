'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import HeroSlider from '../components/products/HeroSlider';
import ProductCard from '../components/products/ProductCard';
import { Link } from 'react-router-dom';
import { productService, categoryService } from '../services/product';
const HomePage = ()=>{
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(()=>{
        fetchData();
    }, []);
    const fetchData = async ()=>{
        try {
            setLoading(true);
            setError(null);
            // Fetch featured products (limit 4)
            const productsResponse = await productService.getAllProducts({
                limit: 8,
                page: 1
            });
            const allProducts = (productsResponse.data.data || productsResponse.data || []).map((p)=>({
                    id: String(p.id),
                    name: p.name,
                    description: p.description,
                    price: parseFloat(p.price),
                    originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
                    discount: p.discount ? parseInt(p.discount) : 0,
                    category: p.category?.name || 'Uncategorized',
                    images: (p.images || []).map((img)=>img.image_url || img.url),
                    thumbnail: p.thumbnail_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/400',
                    rating: parseFloat(p.rating || 0),
                    reviews: p.reviews_count || 0,
                    stock: p.stock || 0,
                    sku: p.sku || '',
                    tags: p.tags || [],
                    createdAt: p.created_at || new Date().toISOString(),
                    updatedAt: p.updated_at || new Date().toISOString()
                }));
            setFeaturedProducts(allProducts.slice(0, 4));
            setBestSellingProducts(allProducts.slice(4, 8));
            // Fetch categories
            const categoriesResponse = await categoryService.getAllCategories();
            setCategories(categoriesResponse.data.data || categoriesResponse.data || []);
        } catch (err) {
            console.error('Failed to fetch home page data:', err);
            setError('Failed to load content');
        // Fallback to empty state - no mock data
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ _jsxs("div", {
        className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
        children: [
            /*#__PURE__*/ _jsx(HeroSlider, {}),
            error && /*#__PURE__*/ _jsx("div", {
                className: "mt-8 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded",
                children: error
            }),
            /*#__PURE__*/ _jsxs("section", {
                className: "mt-16",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: "flex justify-between items-center mb-8",
                        children: [
                            /*#__PURE__*/ _jsx("h2", {
                                className: "text-3xl font-bold text-gray-900",
                                children: "Featured Products"
                            }),
                            /*#__PURE__*/ _jsx(Link, {
                                href: "/products",
                                className: "text-green-600 hover:text-green-700 font-medium",
                                children: "View All →"
                            })
                        ]
                    }),
                    loading ? /*#__PURE__*/ _jsx("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
                        children: [
                            ...Array(4)
                        ].map((_, i)=>/*#__PURE__*/ _jsx("div", {
                                className: "bg-gray-200 rounded-lg h-80 animate-pulse"
                            }, i))
                    }) : featuredProducts.length === 0 ? /*#__PURE__*/ _jsx("p", {
                        className: "text-gray-600 text-center py-8",
                        children: "No featured products available"
                    }) : /*#__PURE__*/ _jsx("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
                        children: featuredProducts.map((product)=>/*#__PURE__*/ _jsx(ProductCard, {
                                product: product
                            }, product.id))
                    })
                ]
            }),
            /*#__PURE__*/ _jsxs("section", {
                className: "mt-16",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: "flex justify-between items-center mb-8",
                        children: [
                            /*#__PURE__*/ _jsx("h2", {
                                className: "text-3xl font-bold text-gray-900",
                                children: "Best Selling Products"
                            }),
                            /*#__PURE__*/ _jsx(Link, {
                                href: "/products?sort=popular",
                                className: "text-green-600 hover:text-green-700 font-medium",
                                children: "View All →"
                            })
                        ]
                    }),
                    loading ? /*#__PURE__*/ _jsx("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
                        children: [
                            ...Array(4)
                        ].map((_, i)=>/*#__PURE__*/ _jsx("div", {
                                className: "bg-gray-200 rounded-lg h-80 animate-pulse"
                            }, i))
                    }) : bestSellingProducts.length === 0 ? /*#__PURE__*/ _jsx("p", {
                        className: "text-gray-600 text-center py-8",
                        children: "No best selling products available"
                    }) : /*#__PURE__*/ _jsx("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
                        children: bestSellingProducts.map((product)=>/*#__PURE__*/ _jsx(ProductCard, {
                                product: product
                            }, product.id))
                    })
                ]
            }),
            /*#__PURE__*/ _jsxs("section", {
                className: "mt-16 mb-16",
                children: [
                    /*#__PURE__*/ _jsx("h2", {
                        className: "text-3xl font-bold text-gray-900 mb-8",
                        children: "Shop by Category"
                    }),
                    loading ? /*#__PURE__*/ _jsx("div", {
                        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
                        children: [
                            ...Array(6)
                        ].map((_, i)=>/*#__PURE__*/ _jsx("div", {
                                className: "bg-gray-200 rounded-lg h-28 animate-pulse"
                            }, i))
                    }) : categories.length === 0 ? /*#__PURE__*/ _jsx("p", {
                        className: "text-gray-600 text-center py-8",
                        children: "No categories available"
                    }) : /*#__PURE__*/ _jsx("div", {
                        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4",
                        children: categories.map((cat)=>{
                            // Get emoji for category
                            const emojiMap = {
                                'Fruits': '🍎',
                                'Vegetables': '🥕',
                                'Fruit': '🍎',
                                'Vegetable': '🥕',
                                'Dairy': '🥛',
                                'Eggs': '🥚',
                                'Meat': '🍖',
                                'Fish': '🐟',
                                'Seafood': '🦐',
                                'Bakery': '🍞',
                                'Bread': '🍞',
                                'Beverage': '🥤',
                                'Beverages': '🥤',
                                'Pantry': '🥫'
                            };
                            let emoji = '📦';
                            for (const [key, val] of Object.entries(emojiMap)){
                                if (cat.name.toLowerCase().includes(key.toLowerCase())) {
                                    emoji = val;
                                    break;
                                }
                            }
                            return /*#__PURE__*/ _jsxs(Link, {
                                href: `/products?category=${cat.id}`,
                                className: "bg-gray-50 p-6 rounded-lg text-center hover:bg-green-50 transition",
                                children: [
                                    /*#__PURE__*/ _jsx("div", {
                                        className: "text-4xl mb-2",
                                        children: emoji
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "font-medium text-gray-800",
                                        children: cat.name
                                    })
                                ]
                            }, cat.id);
                        })
                    })
                ]
            })
        ]
    });
};
export default HomePage;
