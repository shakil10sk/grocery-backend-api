'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/helpers';
export default function CheckoutPage() {
    const { isAuthenticated, signup } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: ''
    });
    const handleChange = (e)=>{
        setFormData((prev)=>({
                ...prev,
                [e.target.name]: e.target.value
            }));
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        // Handle payment processing
        alert('Order placed successfully!');
    };
    // small helper to generate a reasonably strong random password
    const generateRandomPassword = (length = 12)=>{
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=';
        let pass = '';
        for(let i = 0; i < length; i++)pass += chars.charAt(Math.floor(Math.random() * chars.length));
        return pass;
    };
    const [preAuth, setPreAuth] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [autoLoading, setAutoLoading] = useState(false);
    const handlePreAuthChange = (e)=>{
        setPreAuth((p)=>({
                ...p,
                [e.target.name]: e.target.value
            }));
    };
    // const handleGoToLogin = ()=>{
    //     const q = preAuth.email ? `?email=${encodeURIComponent(preAuth.email)}` : '';
    //     navigate(`/auth/login${q}`);
    // };
    const handleAutoSignup = async ()=>{
        if (!preAuth.email) {
            alert('Please provide an email to create an account.');
            return;
        }
        setAutoLoading(true);
        try {
            const password = generateRandomPassword();
            await signup({
                name: `${preAuth.firstName} ${preAuth.lastName}`.trim(),
                email: preAuth.email,
                password
            });
            // user is now signed up & logged in via AuthContext; continue on checkout (re-render will show form)
            alert('Account created and signed in. You can continue with checkout.');
        } catch (err) {
            alert('Could not create account: ' + (err instanceof Error ? err.message : 'Signup failed'));
        } finally{
            setAutoLoading(false);
        }
    };
    // If not authenticated, show inline auth helper so user can login or auto-create account
    if (!isAuthenticated) {
        return /*#__PURE__*/ _jsx("div", {
            className: "max-w-7xl mx-auto px-4 py-16",
            children: /*#__PURE__*/ _jsxs("div", {
                className: "max-w-md mx-auto bg-white rounded-lg shadow-lg p-8",
                children: [
                    /*#__PURE__*/ _jsx("h1", {
                        className: "text-2xl font-bold mb-4 text-center",
                        children: "Checkout — Sign In Required"
                    }),
                    /*#__PURE__*/ _jsx("p", {
                        className: "text-sm text-gray-600 mb-4 text-center",
                        children: "To place an order you must be signed in. You can login, or create an account using your checkout email — we'll generate a password and sign you in automatically."
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                className: "grid grid-cols-2 gap-2",
                                children: [
                                    /*#__PURE__*/ _jsx("input", {
                                        type: "text",
                                        name: "firstName",
                                        placeholder: "First Name",
                                        value: preAuth.firstName,
                                        onChange: handlePreAuthChange,
                                        className: "px-3 py-2 border border-gray-300 rounded"
                                    }),
                                    /*#__PURE__*/ _jsx("input", {
                                        type: "text",
                                        name: "lastName",
                                        placeholder: "Last Name",
                                        value: preAuth.lastName,
                                        onChange: handlePreAuthChange,
                                        className: "px-3 py-2 border border-gray-300 rounded"
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsx("input", {
                                type: "email",
                                name: "email",
                                placeholder: "Email",
                                value: preAuth.email,
                                onChange: handlePreAuthChange,
                                required: true,
                                className: "w-full px-3 py-2 border border-gray-300 rounded"
                            }),
                            /*#__PURE__*/ _jsx("input", {
                                type: "tel",
                                name: "phone",
                                placeholder: "Phone (optional)",
                                value: preAuth.phone,
                                onChange: handlePreAuthChange,
                                className: "w-full px-3 py-2 border border-gray-300 rounded"
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "flex flex-col sm:flex-row gap-3",
                                children: [
                                    /*#__PURE__*/ _jsx("button", {
                                        onClick: handleGoToLogin,
                                        className: "flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition font-medium",
                                        children: "Login to Your Account"
                                    }),
                                    /*#__PURE__*/ _jsx("button", {
                                        onClick: handleAutoSignup,
                                        disabled: autoLoading,
                                        className: "flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition font-medium disabled:opacity-60",
                                        children: autoLoading ? 'Creating Account...' : 'Create Account & Continue'
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsx("div", {
                                className: "text-center text-sm text-gray-600",
                                children: /*#__PURE__*/ _jsx(Link, {
                                    href: "/cart",
                                    className: "text-green-600 hover:underline",
                                    children: "← Back to Cart"
                                })
                            })
                        ]
                    })
                ]
            })
        });
    }
    if (cart.items.length === 0) {
        return /*#__PURE__*/ _jsxs("div", {
            className: "max-w-7xl mx-auto px-4 py-16 text-center",
            children: [
                /*#__PURE__*/ _jsx("h1", {
                    className: "text-3xl font-bold mb-4",
                    children: "Checkout"
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
                children: "Checkout"
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                children: [
                    /*#__PURE__*/ _jsxs("form", {
                        onSubmit: handleSubmit,
                        className: "lg:col-span-2 space-y-8",
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h2", {
                                        className: "text-xl font-bold mb-4",
                                        children: "Shipping Address"
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "grid grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ _jsx("input", {
                                                type: "text",
                                                name: "firstName",
                                                placeholder: "First Name",
                                                value: formData.firstName,
                                                onChange: handleChange,
                                                required: true,
                                                className: "col-span-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                            }),
                                            /*#__PURE__*/ _jsx("input", {
                                                type: "text",
                                                name: "lastName",
                                                placeholder: "Last Name",
                                                value: formData.lastName,
                                                onChange: handleChange,
                                                required: true,
                                                className: "col-span-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                            }),
                                            /*#__PURE__*/ _jsx("input", {
                                                type: "email",
                                                name: "email",
                                                placeholder: "Email",
                                                value: formData.email,
                                                onChange: handleChange,
                                                required: true,
                                                className: "col-span-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                            }),
                                            /*#__PURE__*/ _jsx("input", {
                                                type: "tel",
                                                name: "phone",
                                                placeholder: "Phone",
                                                value: formData.phone,
                                                onChange: handleChange,
                                                required: true,
                                                className: "col-span-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                            }),
                                            /*#__PURE__*/ _jsx("input", {
                                                type: "text",
                                                name: "address",
                                                placeholder: "Street Address",
                                                value: formData.address,
                                                onChange: handleChange,
                                                required: true,
                                                className: "col-span-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                            }),
                                            /*#__PURE__*/ _jsx("input", {
                                                type: "text",
                                                name: "city",
                                                placeholder: "City",
                                                value: formData.city,
                                                onChange: handleChange,
                                                required: true,
                                                className: "col-span-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                            }),
                                            /*#__PURE__*/ _jsx("input", {
                                                type: "text",
                                                name: "state",
                                                placeholder: "State",
                                                value: formData.state,
                                                onChange: handleChange,
                                                required: true,
                                                className: "col-span-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                            }),
                                            /*#__PURE__*/ _jsx("input", {
                                                type: "text",
                                                name: "zipCode",
                                                placeholder: "Zip Code",
                                                value: formData.zipCode,
                                                onChange: handleChange,
                                                required: true,
                                                className: "col-span-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h2", {
                                        className: "text-xl font-bold mb-4",
                                        children: "Payment Method"
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ _jsx("input", {
                                                type: "text",
                                                name: "cardNumber",
                                                placeholder: "Card Number",
                                                value: formData.cardNumber,
                                                onChange: handleChange,
                                                required: true,
                                                className: "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                            }),
                                            /*#__PURE__*/ _jsxs("div", {
                                                className: "grid grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ _jsx("input", {
                                                        type: "text",
                                                        name: "cardExpiry",
                                                        placeholder: "MM/YY",
                                                        value: formData.cardExpiry,
                                                        onChange: handleChange,
                                                        required: true,
                                                        className: "px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                                    }),
                                                    /*#__PURE__*/ _jsx("input", {
                                                        type: "text",
                                                        name: "cardCVC",
                                                        placeholder: "CVC",
                                                        value: formData.cardCVC,
                                                        onChange: handleChange,
                                                        required: true,
                                                        className: "px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsx("button", {
                                type: "submit",
                                className: "w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold text-lg",
                                children: "Place Order"
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "lg:col-span-1",
                        children: /*#__PURE__*/ _jsxs("div", {
                            className: "bg-gray-50 rounded-lg p-6 sticky top-20",
                            children: [
                                /*#__PURE__*/ _jsx("h2", {
                                    className: "text-xl font-bold mb-4",
                                    children: "Order Summary"
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "space-y-3 text-sm border-b pb-4 mb-4 max-h-64 overflow-y-auto",
                                    children: cart.items.map((item)=>/*#__PURE__*/ _jsxs("div", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ _jsxs("span", {
                                                    children: [
                                                        item.product?.name || 'Product',
                                                        " x ",
                                                        item.quantity
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsx("span", {
                                                    children: formatPrice(item.price * item.quantity)
                                                })
                                            ]
                                        }, item.productId))
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "space-y-2 text-sm border-b pb-4 mb-4",
                                    children: [
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ _jsx("span", {
                                                    children: "Subtotal:"
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
                                                    children: "Tax (10%):"
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
                                                    children: "Shipping:"
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
                                    className: "flex justify-between text-xl font-bold",
                                    children: [
                                        /*#__PURE__*/ _jsx("span", {
                                            children: "Total:"
                                        }),
                                        /*#__PURE__*/ _jsx("span", {
                                            children: formatPrice(cart.total)
                                        })
                                    ]
                                })
                            ]
                        })
                    })
                ]
            })
        ]
    });
}
