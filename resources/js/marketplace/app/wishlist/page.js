'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
export default function WishlistPage() {
    const { wishlist, clearWishlist } = useWishlist();
    if (wishlist.length === 0) {
        return /*#__PURE__*/ _jsxs("div", {
            className: "max-w-7xl mx-auto px-4 py-16 text-center",
            children: [
                /*#__PURE__*/ _jsx("h1", {
                    className: "text-3xl font-bold mb-4",
                    children: "My Wishlist"
                }),
                /*#__PURE__*/ _jsx("p", {
                    className: "text-gray-600 mb-8",
                    children: "Your wishlist is empty"
                }),
                /*#__PURE__*/ _jsx(Link, {
                    href: "/products",
                    className: "text-green-600 hover:underline font-medium",
                    children: "Browse Products →"
                })
            ]
        });
    }
    return /*#__PURE__*/ _jsxs("div", {
        className: "max-w-7xl mx-auto px-4 py-8",
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "flex justify-between items-center mb-8",
                children: [
                    /*#__PURE__*/ _jsxs("h1", {
                        className: "text-3xl font-bold",
                        children: [
                            "My Wishlist (",
                            wishlist.length,
                            " items)"
                        ]
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        onClick: clearWishlist,
                        className: "text-red-600 hover:text-red-700 font-medium",
                        children: "Clear Wishlist"
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
                children: wishlist.map((item)=>item.product && /*#__PURE__*/ _jsx(ProductCard, {
                        product: item.product
                    }, item.productId))
            })
        ]
    });
}
