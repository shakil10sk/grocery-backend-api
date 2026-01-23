'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
export const Header = ()=>{
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const { isAuthenticated, user, logout } = useAuth();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        fetchHeaderSettings();
    }, []);
    const fetchHeaderSettings = async ()=>{
        try {
            const response = await api.get('/settings/header');
            setSettings(response.data.data || response.data);
        } catch (err) {
            console.error('Failed to fetch header settings:', err);
            // Use defaults
            setSettings({
                company_name: 'GroceryMart',
                logo_url: null,
                primary_color: '#16a34a',
                secondary_color: '#15803d'
            });
        } finally{
            setLoading(false);
        }
    };
    const primaryColor = settings?.primary_color || '#16a34a';
    const accentStyle = {
        '--primary-color': primaryColor
    };
    if (loading) {
        return /*#__PURE__*/ _jsx("header", {
            className: "sticky top-0 z-50 bg-white shadow h-16",
            children: /*#__PURE__*/ _jsx("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center",
                children: /*#__PURE__*/ _jsx("div", {
                    className: "w-32 h-8 bg-gray-200 rounded animate-pulse"
                })
            })
        });
    }
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            settings?.announcement && /*#__PURE__*/ _jsx("div", {
                className: "bg-yellow-50 border-b border-yellow-200 py-2 text-center text-sm",
                style: {
                    backgroundColor: `${primaryColor}20`
                },
                children: /*#__PURE__*/ _jsx("p", {
                    style: {
                        color: primaryColor
                    },
                    children: settings.announcement
                })
            }),
            /*#__PURE__*/ _jsx("header", {
                className: "sticky top-0 z-50 bg-white shadow",
                style: accentStyle,
                children: /*#__PURE__*/ _jsx("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: /*#__PURE__*/ _jsxs("div", {
                        className: "flex justify-between items-center h-16",
                        children: [
                            /*#__PURE__*/ _jsx(Link, {
                                href: "/",
                                className: "flex items-center",
                                children: settings?.logo_url ? /*#__PURE__*/ _jsx("img", {
                                    src: settings.logo_url,
                                    alt: settings.company_name || 'GroceryMart',
                                    className: "h-12 w-auto"
                                }) : /*#__PURE__*/ _jsxs("div", {
                                    className: "text-2xl font-bold",
                                    style: {
                                        color: primaryColor
                                    },
                                    children: [
                                        "🛒 ",
                                        settings?.company_name || 'GroceryMart'
                                    ]
                                })
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "hidden md:flex flex-1 mx-8",
                                children: /*#__PURE__*/ _jsx("input", {
                                    type: "text",
                                    placeholder: "Search products...",
                                    className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none",
                                    style: {
                                        '--tw-ring-color': primaryColor
                                    }
                                })
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "flex items-center gap-6",
                                children: [
                                    /*#__PURE__*/ _jsxs(Link, {
                                        href: "/wishlist",
                                        className: "relative p-2 hover:bg-gray-100 rounded-lg transition",
                                        title: "Wishlist",
                                        children: [
                                            /*#__PURE__*/ _jsx("span", {
                                                className: "text-xl",
                                                children: "❤️"
                                            }),
                                            wishlist.length > 0 && /*#__PURE__*/ _jsx("span", {
                                                className: "absolute top-1 right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center",
                                                style: {
                                                    backgroundColor: primaryColor
                                                },
                                                children: wishlist.length
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsxs(Link, {
                                        href: "/cart",
                                        className: "relative p-2 hover:bg-gray-100 rounded-lg transition",
                                        title: "Cart",
                                        children: [
                                            /*#__PURE__*/ _jsx("span", {
                                                className: "text-xl",
                                                children: "🛒"
                                            }),
                                            cart.items.length > 0 && /*#__PURE__*/ _jsx("span", {
                                                className: "absolute top-1 right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center",
                                                style: {
                                                    backgroundColor: primaryColor
                                                },
                                                children: cart.items.length
                                            })
                                        ]
                                    }),
                                    isAuthenticated ? /*#__PURE__*/ _jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ _jsx(Link, {
                                                href: "/profile",
                                                className: "hover:underline",
                                                children: user?.name || 'Profile'
                                            }),
                                            /*#__PURE__*/ _jsx("button", {
                                                onClick: logout,
                                                className: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition",
                                                children: "Logout"
                                            })
                                        ]
                                    }) : /*#__PURE__*/ _jsx("div", {})
                                ]
                            })
                        ]
                    })
                })
            })
        ]
    });
};
export default Header;
