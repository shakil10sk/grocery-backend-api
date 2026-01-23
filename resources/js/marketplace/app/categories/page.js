'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../../services/product';
export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(()=>{
        fetchCategories();
    }, []);
    const fetchCategories = async ()=>{
        try {
            setLoading(true);
            setError(null);
            const response = await categoryService.getAllCategories();
            const data = response.data.data || response.data || [];
            setCategories(data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            setError('Failed to load categories');
            // Fallback to mock data
            setCategories([
                {
                    id: '1',
                    name: 'Fruits & Vegetables',
                    description: 'Fresh and organic produce',
                    products_count: 245
                },
                {
                    id: '2',
                    name: 'Dairy & Eggs',
                    description: 'Quality dairy products',
                    products_count: 156
                },
                {
                    id: '3',
                    name: 'Meat & Fish',
                    description: 'Premium quality meat',
                    products_count: 98
                },
                {
                    id: '4',
                    name: 'Bakery',
                    description: 'Fresh baked goods',
                    products_count: 87
                },
                {
                    id: '5',
                    name: 'Beverages',
                    description: 'Drinks and juices',
                    products_count: 134
                },
                {
                    id: '6',
                    name: 'Pantry',
                    description: 'Staple groceries',
                    products_count: 312
                }
            ]);
        } finally{
            setLoading(false);
        }
    };
    // Get emoji for category based on name
    const getCategoryEmoji = (name)=>{
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
            'Pantry': '🥫',
            'Grocery': '🛒'
        };
        for (const [key, emoji] of Object.entries(emojiMap)){
            if (name.toLowerCase().includes(key.toLowerCase())) {
                return emoji;
            }
        }
        return '📦';
    };
    return /*#__PURE__*/ _jsxs("div", {
        className: "max-w-7xl mx-auto px-4 py-8",
        children: [
            /*#__PURE__*/ _jsx("h1", {
                className: "text-3xl font-bold mb-4",
                children: "Shop by Category"
            }),
            /*#__PURE__*/ _jsx("p", {
                className: "text-gray-600 mb-8",
                children: "Browse our wide selection of products"
            }),
            error && /*#__PURE__*/ _jsxs("div", {
                className: "mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded",
                children: [
                    error,
                    " - Showing default categories"
                ]
            }),
            loading ? /*#__PURE__*/ _jsx("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: [
                    ...Array(6)
                ].map((_, i)=>/*#__PURE__*/ _jsx("div", {
                        className: "bg-gray-200 rounded-lg h-64 animate-pulse"
                    }, i))
            }) : categories.length === 0 ? /*#__PURE__*/ _jsx("div", {
                className: "text-center py-12",
                children: /*#__PURE__*/ _jsx("p", {
                    className: "text-gray-600 text-lg",
                    children: "No categories available."
                })
            }) : /*#__PURE__*/ _jsx("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: categories.map((category)=>/*#__PURE__*/ _jsxs(Link, {
                        href: `/products?category=${category.id}`,
                        className: "bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group",
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "aspect-video bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-7xl group-hover:scale-110 transition",
                                children: getCategoryEmoji(category.name)
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h3", {
                                        className: "text-xl font-bold text-gray-900 group-hover:text-green-600 transition",
                                        children: category.name
                                    }),
                                    category.description && /*#__PURE__*/ _jsx("p", {
                                        className: "text-gray-600 text-sm mb-3",
                                        children: category.description
                                    }),
                                    /*#__PURE__*/ _jsxs("p", {
                                        className: "text-gray-500 text-xs",
                                        children: [
                                            category.products_count || 0,
                                            " products"
                                        ]
                                    })
                                ]
                            })
                        ]
                    }, category.id))
            })
        ]
    });
}
