'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
import { Link } from 'react-router-dom';
export default function CartPage() {
    const { cart, removeFromCart, updateQuantity } = useCart();
    if (cart.items.length === 0) {
        return /*#__PURE__*/ _jsxs("div", {
            className: "max-w-7xl mx-auto px-4 py-16 text-center",
            children: [
                /*#__PURE__*/ _jsx("h1", {
                    className: "text-3xl font-bold mb-4",
                    children: "Shopping Cart"
                }),
                /*#__PURE__*/ _jsx("p", {
                    className: "text-gray-600 mb-8",
                    children: "Your cart is empty"
                }),
                /*#__PURE__*/ _jsx(Link, {
                    href: "/products",
                    className: "text-green-600 hover:underline font-medium",
                    children: "Continue Shopping →"
                })
            ]
        });
    }
    return /*#__PURE__*/ _jsxs("div", {
        className: "max-w-7xl mx-auto px-4 py-8",
        children: [
            /*#__PURE__*/ _jsx("h1", {
                className: "text-3xl font-bold mb-8",
                children: "Shopping Cart"
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        className: "lg:col-span-2",
                        children: /*#__PURE__*/ _jsx("div", {
                            className: "bg-white rounded-lg shadow",
                            children: /*#__PURE__*/ _jsxs("table", {
                                className: "w-full",
                                children: [
                                    /*#__PURE__*/ _jsx("thead", {
                                        className: "border-b",
                                        children: /*#__PURE__*/ _jsxs("tr", {
                                            children: [
                                                /*#__PURE__*/ _jsx("th", {
                                                    className: "text-left p-4",
                                                    children: "Product"
                                                }),
                                                /*#__PURE__*/ _jsx("th", {
                                                    className: "text-center p-4",
                                                    children: "Quantity"
                                                }),
                                                /*#__PURE__*/ _jsx("th", {
                                                    className: "text-right p-4",
                                                    children: "Price"
                                                }),
                                                /*#__PURE__*/ _jsx("th", {
                                                    className: "text-right p-4",
                                                    children: "Total"
                                                }),
                                                /*#__PURE__*/ _jsx("th", {
                                                    className: "text-right p-4",
                                                    children: "Action"
                                                })
                                            ]
                                        })
                                    }),
                                    /*#__PURE__*/ _jsx("tbody", {
                                        children: cart.items.map((item)=>/*#__PURE__*/ _jsxs("tr", {
                                                className: "border-b hover:bg-gray-50",
                                                children: [
                                                    /*#__PURE__*/ _jsx("td", {
                                                        className: "p-4",
                                                        children: /*#__PURE__*/ _jsxs("div", {
                                                            children: [
                                                                /*#__PURE__*/ _jsx("p", {
                                                                    className: "font-medium",
                                                                    children: item.product?.name || 'Product'
                                                                }),
                                                                /*#__PURE__*/ _jsxs("p", {
                                                                    className: "text-sm text-gray-600",
                                                                    children: [
                                                                        "SKU: ",
                                                                        item.product?.sku
                                                                    ]
                                                                })
                                                            ]
                                                        })
                                                    }),
                                                    /*#__PURE__*/ _jsx("td", {
                                                        className: "p-4 text-center",
                                                        children: /*#__PURE__*/ _jsx("select", {
                                                            value: item.quantity,
                                                            onChange: (e)=>updateQuantity(item.productId, parseInt(e.target.value)),
                                                            className: "border border-gray-300 rounded px-2 py-1",
                                                            children: Array.from({
                                                                length: 10
                                                            }, (_, i)=>/*#__PURE__*/ _jsx("option", {
                                                                    value: i + 1,
                                                                    children: i + 1
                                                                }, i + 1))
                                                        })
                                                    }),
                                                    /*#__PURE__*/ _jsx("td", {
                                                        className: "p-4 text-right",
                                                        children: formatPrice(item.price)
                                                    }),
                                                    /*#__PURE__*/ _jsx("td", {
                                                        className: "p-4 text-right font-medium",
                                                        children: formatPrice(item.price * item.quantity)
                                                    }),
                                                    /*#__PURE__*/ _jsx("td", {
                                                        className: "p-4 text-right",
                                                        children: /*#__PURE__*/ _jsx("button", {
                                                            onClick: ()=>removeFromCart(item.productId),
                                                            className: "text-red-600 hover:text-red-700 font-medium",
                                                            children: "Remove"
                                                        })
                                                    })
                                                ]
                                            }, item.productId))
                                    })
                                ]
                            })
                        })
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "lg:col-span-1",
                        children: /*#__PURE__*/ _jsxs("div", {
                            className: "bg-gray-50 rounded-lg p-6 sticky top-20",
                            children: [
                                /*#__PURE__*/ _jsx("h2", {
                                    className: "text-2xl font-bold mb-6",
                                    children: "Order Summary"
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "space-y-4 mb-6 border-b pb-6",
                                    children: [
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ _jsx("span", {
                                                    children: "Subtotal"
                                                }),
                                                /*#__PURE__*/ _jsx("span", {
                                                    children: formatPrice(cart.subTotal)
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ _jsx("span", {
                                                    children: "Tax (10%)"
                                                }),
                                                /*#__PURE__*/ _jsx("span", {
                                                    children: formatPrice(cart.tax)
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ _jsx("span", {
                                                    children: "Shipping"
                                                }),
                                                /*#__PURE__*/ _jsx("span", {
                                                    className: cart.shipping === 0 ? 'text-green-600 font-medium' : '',
                                                    children: cart.shipping === 0 ? 'FREE' : formatPrice(cart.shipping)
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "flex justify-between text-xl font-bold mb-6",
                                    children: [
                                        /*#__PURE__*/ _jsx("span", {
                                            children: "Total"
                                        }),
                                        /*#__PURE__*/ _jsx("span", {
                                            children: formatPrice(cart.total)
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsx(Link, {
                                    href: "/checkout",
                                    className: "w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium text-center block",
                                    children: "Proceed to Checkout"
                                }),
                                /*#__PURE__*/ _jsx(Link, {
                                    href: "/products",
                                    className: "w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-100 transition font-medium text-center block",
                                    children: "Continue Shopping"
                                })
                            ]
                        })
                    })
                ]
            })
        ]
    });
}
