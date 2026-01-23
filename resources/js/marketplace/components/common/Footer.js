'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
export const Footer = ()=>{
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        fetchFooterSettings();
    }, []);
    const fetchFooterSettings = async ()=>{
        try {
            const response = await api.get('/settings/footer');
            setSettings(response.data.data || response.data);
        } catch (err) {
            console.error('Failed to fetch footer settings:', err);
            // Use defaults
            setSettings({
                company_name: 'GroceryMart',
                company_description: 'Your trusted online grocery store delivering fresh products to your doorstep.',
                company_email: 'support@grocerymart.com',
                company_phone: '1-800-GROCERY',
                company_address: '123 Market Street, NY 10001'
            });
        } finally{
            setLoading(false);
        }
    };
    if (loading) {
        return /*#__PURE__*/ _jsx("footer", {
            className: "bg-gray-800 text-white mt-16",
            children: /*#__PURE__*/ _jsx("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
                children: /*#__PURE__*/ _jsx("div", {
                    className: "h-40 bg-gray-700 rounded animate-pulse"
                })
            })
        });
    }
    return /*#__PURE__*/ _jsx("footer", {
        className: "bg-gray-800 text-white mt-16",
        children: /*#__PURE__*/ _jsxs("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",
            children: [
                /*#__PURE__*/ _jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-4 gap-8 mb-8",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            children: [
                                /*#__PURE__*/ _jsxs("h3", {
                                    className: "text-lg font-bold mb-4",
                                    children: [
                                        "About ",
                                        settings?.company_name || 'GroceryMart'
                                    ]
                                }),
                                /*#__PURE__*/ _jsx("p", {
                                    className: "text-gray-400 text-sm",
                                    children: settings?.company_description || 'Your trusted online grocery store delivering fresh products to your doorstep.'
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            children: [
                                /*#__PURE__*/ _jsx("h3", {
                                    className: "text-lg font-bold mb-4",
                                    children: "Quick Links"
                                }),
                                /*#__PURE__*/ _jsxs("ul", {
                                    className: "space-y-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ _jsx("li", {
                                            children: /*#__PURE__*/ _jsx(Link, {
                                                href: "/",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "Home"
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx("li", {
                                            children: /*#__PURE__*/ _jsx(Link, {
                                                href: "/categories",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "Categories"
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx("li", {
                                            children: /*#__PURE__*/ _jsx(Link, {
                                                href: "/products",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "Products"
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx("li", {
                                            children: /*#__PURE__*/ _jsx(Link, {
                                                href: "/blog",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "Blog"
                                            })
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            children: [
                                /*#__PURE__*/ _jsx("h3", {
                                    className: "text-lg font-bold mb-4",
                                    children: "Customer Service"
                                }),
                                /*#__PURE__*/ _jsxs("ul", {
                                    className: "space-y-2 text-sm",
                                    children: [
                                        /*#__PURE__*/ _jsx("li", {
                                            children: /*#__PURE__*/ _jsx(Link, {
                                                href: "/contact",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "Contact Us"
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx("li", {
                                            children: /*#__PURE__*/ _jsx(Link, {
                                                href: "#",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "Shipping Info"
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx("li", {
                                            children: /*#__PURE__*/ _jsx(Link, {
                                                href: "#",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "Returns"
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx("li", {
                                            children: /*#__PURE__*/ _jsx(Link, {
                                                href: "#",
                                                className: "text-gray-400 hover:text-white transition",
                                                children: "Privacy Policy"
                                            })
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            children: [
                                /*#__PURE__*/ _jsx("h3", {
                                    className: "text-lg font-bold mb-4",
                                    children: "Contact Us"
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "space-y-2 text-sm text-gray-400",
                                    children: [
                                        settings?.company_email && /*#__PURE__*/ _jsxs("p", {
                                            children: [
                                                "📧 ",
                                                settings.company_email
                                            ]
                                        }),
                                        settings?.company_phone && /*#__PURE__*/ _jsxs("p", {
                                            children: [
                                                "📞 ",
                                                settings.company_phone
                                            ]
                                        }),
                                        settings?.company_address && /*#__PURE__*/ _jsxs("p", {
                                            children: [
                                                "📍 ",
                                                settings.company_address
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ _jsx("div", {
                    className: "border-t border-gray-700 pt-8",
                    children: /*#__PURE__*/ _jsx("p", {
                        className: "text-center text-gray-400 text-sm",
                        children: settings?.footer_text || `&copy; 2024 ${settings?.company_name || 'GroceryMart'}. All rights reserved.`
                    })
                })
            ]
        })
    });
};
export default Footer;
