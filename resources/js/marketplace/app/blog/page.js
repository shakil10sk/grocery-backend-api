'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(()=>{
        fetchBlogPosts();
    }, []);
    const fetchBlogPosts = async ()=>{
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/blog/posts');
            const data = response.data.data || response.data || [];
            setPosts(data);
        } catch (err) {
            console.error('Failed to fetch blog posts:', err);
            setError('Failed to load blog posts');
            setPosts([]);
        } finally{
            setLoading(false);
        }
    };
    const getEmoji = (title)=>{
        const emojiMap = {
            'storing': '🥬',
            'fresh': '🥬',
            'produce': '🥬',
            'seasonal': '❄️',
            'winter': '❄️',
            'organic': '🌱',
            'conventional': '🌱',
            'recipe': '👨‍🍳',
            'recipes': '👨‍🍳',
            'cook': '👨‍🍳'
        };
        for (const [key, emoji] of Object.entries(emojiMap)){
            if (title.toLowerCase().includes(key)) {
                return emoji;
            }
        }
        return '📝';
    };
    const getCategoryName = (category)=>{
        if (typeof category === 'string') return category;
        if (category?.name) return category.name;
        return 'Blog';
    };
    return /*#__PURE__*/ _jsxs("div", {
        className: "max-w-7xl mx-auto px-4 py-8",
        children: [
            /*#__PURE__*/ _jsx("h1", {
                className: "text-3xl font-bold mb-4",
                children: "Blog"
            }),
            /*#__PURE__*/ _jsx("p", {
                className: "text-gray-600 mb-8",
                children: "Tips, recipes, and insights about healthy eating"
            }),
            error && /*#__PURE__*/ _jsx("div", {
                className: "mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded",
                children: error
            }),
            loading ? /*#__PURE__*/ _jsx("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-8",
                children: [
                    ...Array(4)
                ].map((_, i)=>/*#__PURE__*/ _jsx("div", {
                        className: "bg-gray-200 rounded-lg h-80 animate-pulse"
                    }, i))
            }) : posts.length === 0 ? /*#__PURE__*/ _jsx("div", {
                className: "text-center py-12",
                children: /*#__PURE__*/ _jsx("p", {
                    className: "text-gray-600 text-lg",
                    children: "No blog posts available."
                })
            }) : /*#__PURE__*/ _jsx("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-8",
                children: posts.map((post)=>/*#__PURE__*/ _jsxs(Link, {
                        href: `/blog/${post.slug || post.id}`,
                        className: "bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden",
                        children: [
                            post.featured_image ? /*#__PURE__*/ _jsx("img", {
                                src: post.featured_image,
                                alt: post.title,
                                className: "w-full aspect-video object-cover"
                            }) : /*#__PURE__*/ _jsx("div", {
                                className: "w-full aspect-video bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-6xl",
                                children: getEmoji(post.title)
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "text-xs text-green-600 uppercase tracking-wide mb-2",
                                        children: getCategoryName(post.category)
                                    }),
                                    /*#__PURE__*/ _jsx("h3", {
                                        className: "text-xl font-bold text-gray-900 mb-2 hover:text-green-600 transition",
                                        children: post.title
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "text-gray-600 text-sm mb-4",
                                        children: post.excerpt || post.content?.substring(0, 100) + '...' || 'Read more'
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "flex justify-between items-center text-xs text-gray-500",
                                        children: [
                                            /*#__PURE__*/ _jsx("span", {
                                                children: post.author || post.author_name || 'Anonymous'
                                            }),
                                            /*#__PURE__*/ _jsx("span", {
                                                children: post.published_at ? new Date(post.published_at).toLocaleDateString() : post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recent'
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    }, post.id))
            })
        ]
    });
}
