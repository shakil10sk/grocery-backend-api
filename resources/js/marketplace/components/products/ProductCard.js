'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
export const ProductCard = ({ product })=>{
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [quantity, setQuantity] = useState(1);
    const inWishlist = isInWishlist(product.id);
    const handleAddToCart = ()=>{
        addToCart(product, quantity);
        setQuantity(1);
    };
    return /*#__PURE__*/ _jsxs("div", {
        className: "bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden",
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "relative group",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: "aspect-square bg-gray-100 overflow-hidden relative",
                        children: [
                            /*#__PURE__*/ _jsx("img", {
                                src: product.thumbnail,
                                alt: product.name,
                                className: "w-full h-full object-cover group-hover:scale-110 transition"
                            }),
                            product.discount && /*#__PURE__*/ _jsxs("div", {
                                className: "absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold",
                                children: [
                                    "-",
                                    product.discount,
                                    "%"
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        onClick: ()=>inWishlist ? removeFromWishlist(product.id) : addToWishlist(product),
                        className: "absolute top-3 left-3 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:shadow-lg transition",
                        title: inWishlist ? 'Remove from wishlist' : 'Add to wishlist',
                        children: /*#__PURE__*/ _jsx("span", {
                            className: "text-lg",
                            children: inWishlist ? '❤️' : '🤍'
                        })
                    })
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "p-4",
                children: [
                    /*#__PURE__*/ _jsx("p", {
                        className: "text-xs text-gray-500 uppercase tracking-wide mb-1",
                        children: product.category
                    }),
                    /*#__PURE__*/ _jsx(Link, {
                        href: `/products/${product.id}`,
                        children: /*#__PURE__*/ _jsx("h3", {
                            className: "text-sm font-semibold text-gray-800 hover:text-green-600 transition line-clamp-2 mb-2",
                            children: product.name
                        })
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "flex items-center gap-1 mb-2",
                        children: [
                            /*#__PURE__*/ _jsx("span", {
                                className: "text-yellow-400",
                                children: "⭐"
                            }),
                            /*#__PURE__*/ _jsxs("span", {
                                className: "text-xs text-gray-600",
                                children: [
                                    product.rating,
                                    " (",
                                    product.reviews,
                                    " reviews)"
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "flex items-center gap-2 mb-3",
                        children: [
                            /*#__PURE__*/ _jsx("span", {
                                className: "text-lg font-bold text-gray-900",
                                children: formatPrice(product.price)
                            }),
                            product.originalPrice && /*#__PURE__*/ _jsx("span", {
                                className: "text-sm text-gray-500 line-through",
                                children: formatPrice(product.originalPrice)
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        className: `text-xs mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`,
                        children: product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ _jsx("select", {
                                value: quantity,
                                onChange: (e)=>setQuantity(parseInt(e.target.value)),
                                className: "border border-gray-300 rounded px-2 py-1 text-sm",
                                disabled: product.stock === 0,
                                children: Array.from({
                                    length: Math.min(product.stock, 10)
                                }, (_, i)=>/*#__PURE__*/ _jsx("option", {
                                        value: i + 1,
                                        children: i + 1
                                    }, i + 1))
                            }),
                            /*#__PURE__*/ _jsx("button", {
                                onClick: handleAddToCart,
                                disabled: product.stock === 0,
                                className: "flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium",
                                children: "Add to Cart"
                            })
                        ]
                    })
                ]
            })
        ]
    });
};
export default ProductCard;
