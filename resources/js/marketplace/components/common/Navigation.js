'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
export const Navigation = ()=>{
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const categories = [
        {
            name: 'Fruits & Vegetables',
            slug: 'fruits-vegetables'
        },
        {
            name: 'Dairy & Eggs',
            slug: 'dairy-eggs'
        },
        {
            name: 'Meat & Fish',
            slug: 'meat-fish'
        },
        {
            name: 'Pantry',
            slug: 'pantry'
        },
        {
            name: 'Bakery',
            slug: 'bakery'
        },
        {
            name: 'Beverages',
            slug: 'beverages'
        }
    ];
    return /*#__PURE__*/ _jsx("nav", {
        className: "bg-gray-50 border-b border-gray-200",
        children: /*#__PURE__*/ _jsx("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
            children: /*#__PURE__*/ _jsxs("div", {
                className: "flex justify-between items-center h-14",
                children: [
                    /*#__PURE__*/ _jsx("button", {
                        className: "md:hidden p-2",
                        onClick: ()=>setIsMobileMenuOpen(!isMobileMenuOpen),
                        children: "☰"
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "hidden md:flex gap-8",
                        children: [
                            /*#__PURE__*/ _jsx(Link, {
                                href: "/",
                                className: "text-gray-700 hover:text-green-600 transition font-medium",
                                children: "Home"
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "group relative",
                                children: [
                                    /*#__PURE__*/ _jsx("button", {
                                        className: "text-gray-700 hover:text-green-600 transition font-medium flex items-center gap-1",
                                        children: "Categories ▼"
                                    }),
                                    /*#__PURE__*/ _jsx("div", {
                                        className: "absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition",
                                        children: categories.map((cat)=>/*#__PURE__*/ _jsx(Link, {
                                                href: `/categories/${cat.slug}`,
                                                className: "block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition first:rounded-t-lg last:rounded-b-lg",
                                                children: cat.name
                                            }, cat.slug))
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsx(Link, {
                                href: "/blog",
                                className: "text-gray-700 hover:text-green-600 transition font-medium",
                                children: "Blog"
                            }),
                            /*#__PURE__*/ _jsx(Link, {
                                href: "/contact",
                                className: "text-gray-700 hover:text-green-600 transition font-medium",
                                children: "Contact"
                            })
                        ]
                    }),
                    isMobileMenuOpen && /*#__PURE__*/ _jsx("div", {
                        className: "absolute top-14 left-0 right-0 bg-white shadow-lg md:hidden",
                        children: /*#__PURE__*/ _jsxs("div", {
                            className: "flex flex-col p-4 space-y-3",
                            children: [
                                /*#__PURE__*/ _jsx(Link, {
                                    href: "/",
                                    className: "text-gray-700 hover:text-green-600 transition",
                                    children: "Home"
                                }),
                                /*#__PURE__*/ _jsx("span", {
                                    className: "text-gray-700 font-medium",
                                    children: "Categories"
                                }),
                                categories.map((cat)=>/*#__PURE__*/ _jsx(Link, {
                                        href: `/categories/${cat.slug}`,
                                        className: "text-gray-600 hover:text-green-600 transition pl-4",
                                        children: cat.name
                                    }, cat.slug)),
                                /*#__PURE__*/ _jsx(Link, {
                                    href: "/blog",
                                    className: "text-gray-700 hover:text-green-600 transition",
                                    children: "Blog"
                                }),
                                /*#__PURE__*/ _jsx(Link, {
                                    href: "/contact",
                                    className: "text-gray-700 hover:text-green-600 transition",
                                    children: "Contact"
                                })
                            ]
                        })
                    })
                ]
            })
        })
    });
};
export default Navigation;
