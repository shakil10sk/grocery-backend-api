'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { formatPrice } from '../../../utils/helpers';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/product';
export default function ProductDetailsPage({ params }) {
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: '5',
        title: '',
        comment: ''
    });
    // Fetch product
    useEffect(()=>{
        fetchProduct();
    }, [
        params.id
    ]);
    // Fetch reviews
    useEffect(()=>{
        if (product) {
            fetchReviews();
        }
    }, [
        product?.id
    ]);
    const fetchProduct = async ()=>{
        try {
            setLoading(true);
            setError(null);
            const response = await productService.getProduct(params.id);
            const p = response.data.data || response.data;
            const transformed = {
                id: String(p.id),
                name: p.name,
                description: p.description,
                price: parseFloat(p.price),
                originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
                discount: p.discount ? parseInt(p.discount) : 0,
                category: p.category?.name || 'Uncategorized',
                images: (p.images || []).map((img)=>img.image_url || img.url),
                thumbnail: p.thumbnail_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/600',
                rating: parseFloat(p.rating || 0),
                reviews: p.reviews_count || 0,
                stock: p.stock || 0,
                sku: p.sku || '',
                tags: p.tags || [],
                specifications: p.specifications,
                createdAt: p.created_at || new Date().toISOString(),
                updatedAt: p.updated_at || new Date().toISOString()
            };
            setProduct(transformed);
        } catch (err) {
            console.error('Failed to fetch product:', err);
            setError('Failed to load product details');
        } finally{
            setLoading(false);
        }
    };
    const fetchReviews = async ()=>{
        try {
            setReviewLoading(true);
            const response = await productService.getProductReviews(params.id);
            const data = response.data.data || response.data || [];
            setReviews(data);
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
            setReviews([]);
        } finally{
            setReviewLoading(false);
        }
    };
    const handleAddToCart = ()=>{
        if (product) {
            addToCart(product, quantity);
            alert('Added to cart!');
        }
    };
    const handleSubmitReview = async ()=>{
        if (!product || !reviewForm.title.trim() || !reviewForm.comment.trim()) {
            alert('Please fill in all fields');
            return;
        }
        try {
            await productService.createReview(product.id, {
                rating: parseInt(reviewForm.rating),
                title: reviewForm.title,
                comment: reviewForm.comment
            });
            setReviewForm({
                rating: '5',
                title: '',
                comment: ''
            });
            setShowReviewForm(false);
            fetchReviews(); // Refresh reviews
            alert('Review submitted successfully!');
        } catch (err) {
            console.error('Failed to submit review:', err);
            alert('Failed to submit review');
        }
    };
    if (loading) {
        return /*#__PURE__*/ _jsx("div", {
            className: "max-w-7xl mx-auto px-4 py-8",
            children: /*#__PURE__*/ _jsxs("div", {
                className: "animate-pulse",
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        className: "h-64 bg-gray-200 rounded-lg mb-8"
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "h-8 bg-gray-200 rounded w-1/2 mb-4"
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: "h-6 bg-gray-200 rounded w-1/3"
                    })
                ]
            })
        });
    }
    if (error || !product) {
        return /*#__PURE__*/ _jsx("div", {
            className: "max-w-7xl mx-auto px-4 py-8",
            children: /*#__PURE__*/ _jsx("div", {
                className: "p-4 bg-red-100 border border-red-400 text-red-700 rounded",
                children: error || 'Product not found'
            })
        });
    }
    const inWishlist = isInWishlist(product.id);
    return /*#__PURE__*/ _jsxs("div", {
        className: "max-w-7xl mx-auto px-4 py-8",
        children: [
            /*#__PURE__*/ _jsxs("nav", {
                className: "flex gap-2 mb-8 text-sm text-gray-600",
                children: [
                    /*#__PURE__*/ _jsx(Link, {
                        href: "/",
                        className: "hover:text-gray-900",
                        children: "Home"
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        children: "/"
                    }),
                    /*#__PURE__*/ _jsx(Link, {
                        href: "/categories",
                        className: "hover:text-gray-900",
                        children: "Categories"
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        children: "/"
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        children: product.category
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        children: "/"
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        className: "text-gray-900",
                        children: product.name
                    })
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                className: "bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center",
                                children: /*#__PURE__*/ _jsx("img", {
                                    src: product.images?.[selectedImage] || product.thumbnail,
                                    alt: product.name,
                                    className: "w-full h-full object-cover"
                                })
                            }),
                            product.images && product.images.length > 1 && /*#__PURE__*/ _jsx("div", {
                                className: "flex gap-2",
                                children: product.images.map((img, idx)=>/*#__PURE__*/ _jsx("button", {
                                        onClick: ()=>setSelectedImage(idx),
                                        className: `w-20 h-20 rounded border-2 overflow-hidden ${idx === selectedImage ? 'border-green-600' : 'border-gray-200 hover:border-gray-300'}`,
                                        children: /*#__PURE__*/ _jsx("img", {
                                            src: img,
                                            alt: "",
                                            className: "w-full h-full object-cover"
                                        })
                                    }, idx))
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx("p", {
                                className: "text-xs text-gray-500 uppercase tracking-wide mb-2",
                                children: product.category
                            }),
                            /*#__PURE__*/ _jsx("h1", {
                                className: "text-3xl font-bold text-gray-900 mb-2",
                                children: product.name
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "flex items-center gap-4 mb-4",
                                children: [
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ _jsx("span", {
                                                className: "text-yellow-400",
                                                children: "⭐"
                                            }),
                                            /*#__PURE__*/ _jsx("span", {
                                                className: "font-semibold",
                                                children: product.rating.toFixed(1)
                                            }),
                                            /*#__PURE__*/ _jsxs("span", {
                                                className: "text-gray-600 text-sm",
                                                children: [
                                                    "(",
                                                    product.reviews,
                                                    " reviews)"
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsx("span", {
                                        className: `font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`,
                                        children: product.stock > 0 ? 'In Stock' : 'Out of Stock'
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "flex items-center gap-3 mb-6",
                                children: [
                                    /*#__PURE__*/ _jsx("span", {
                                        className: "text-4xl font-bold text-gray-900",
                                        children: formatPrice(product.price)
                                    }),
                                    product.originalPrice && /*#__PURE__*/ _jsxs(_Fragment, {
                                        children: [
                                            /*#__PURE__*/ _jsx("span", {
                                                className: "text-xl text-gray-500 line-through",
                                                children: formatPrice(product.originalPrice)
                                            }),
                                            /*#__PURE__*/ _jsxs("span", {
                                                className: "bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold",
                                                children: [
                                                    "Save ",
                                                    product.discount,
                                                    "%"
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("p", {
                                className: "text-sm text-gray-600 mb-6",
                                children: [
                                    "SKU: ",
                                    product.sku
                                ]
                            }),
                            /*#__PURE__*/ _jsx("p", {
                                className: "text-gray-700 mb-6",
                                children: product.description
                            }),
                            product.specifications && /*#__PURE__*/ _jsxs("div", {
                                className: "bg-gray-50 rounded-lg p-4 mb-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h3", {
                                        className: "font-semibold mb-3",
                                        children: "Specifications"
                                    }),
                                    /*#__PURE__*/ _jsx("dl", {
                                        className: "space-y-2 text-sm",
                                        children: Object.entries(product.specifications).map(([key, value])=>/*#__PURE__*/ _jsxs("div", {
                                                className: "flex justify-between",
                                                children: [
                                                    /*#__PURE__*/ _jsxs("dt", {
                                                        className: "text-gray-600",
                                                        children: [
                                                            key,
                                                            ":"
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ _jsx("dd", {
                                                        className: "font-medium",
                                                        children: String(value)
                                                    })
                                                ]
                                            }, key))
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "space-y-3 mb-6",
                                children: [
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "flex items-center gap-4",
                                        children: [
                                            /*#__PURE__*/ _jsx("label", {
                                                className: "text-sm font-medium",
                                                children: "Quantity:"
                                            }),
                                            /*#__PURE__*/ _jsx("select", {
                                                value: quantity,
                                                onChange: (e)=>setQuantity(parseInt(e.target.value)),
                                                disabled: product.stock === 0,
                                                className: "border border-gray-300 rounded px-3 py-2 disabled:opacity-50",
                                                children: Array.from({
                                                    length: Math.min(product.stock, 20)
                                                }, (_, i)=>/*#__PURE__*/ _jsx("option", {
                                                        value: i + 1,
                                                        children: i + 1
                                                    }, i + 1))
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ _jsxs("button", {
                                                onClick: handleAddToCart,
                                                disabled: product.stock === 0,
                                                className: "flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold disabled:opacity-50",
                                                children: [
                                                    "🛒 ",
                                                    product.stock > 0 ? 'Add to Cart' : 'Out of Stock'
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsx("button", {
                                                onClick: ()=>inWishlist ? removeFromWishlist(product.id) : addToWishlist(product),
                                                className: "px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-red-500 transition font-bold",
                                                children: inWishlist ? '❤️' : '🤍'
                                            })
                                        ]
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "grid grid-cols-2 gap-4 py-6 border-t border-b",
                                children: [
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ _jsx("p", {
                                                className: "text-2xl mb-2",
                                                children: "🚚"
                                            }),
                                            /*#__PURE__*/ _jsx("p", {
                                                className: "text-sm font-medium",
                                                children: "Free Shipping"
                                            }),
                                            /*#__PURE__*/ _jsx("p", {
                                                className: "text-xs text-gray-600",
                                                children: "On orders over $100"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "text-center",
                                        children: [
                                            /*#__PURE__*/ _jsx("p", {
                                                className: "text-2xl mb-2",
                                                children: "🔄"
                                            }),
                                            /*#__PURE__*/ _jsx("p", {
                                                className: "text-sm font-medium",
                                                children: "Easy Returns"
                                            }),
                                            /*#__PURE__*/ _jsx("p", {
                                                className: "text-xs text-gray-600",
                                                children: "30-day return policy"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "bg-white rounded-lg shadow p-8 mb-8",
                children: [
                    /*#__PURE__*/ _jsxs("div", {
                        className: "flex justify-between items-center mb-8",
                        children: [
                            /*#__PURE__*/ _jsx("h2", {
                                className: "text-2xl font-bold",
                                children: "Customer Reviews"
                            }),
                            /*#__PURE__*/ _jsx("button", {
                                onClick: ()=>setShowReviewForm(!showReviewForm),
                                className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition",
                                children: "Write a Review"
                            })
                        ]
                    }),
                    showReviewForm && /*#__PURE__*/ _jsx("div", {
                        className: "bg-gray-50 rounded-lg p-6 mb-8",
                        children: /*#__PURE__*/ _jsxs("form", {
                            onSubmit: (e)=>{
                                e.preventDefault();
                                handleSubmitReview();
                            },
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("label", {
                                            className: "block text-sm font-medium mb-2",
                                            children: "Rating"
                                        }),
                                        /*#__PURE__*/ _jsxs("select", {
                                            value: reviewForm.rating,
                                            onChange: (e)=>setReviewForm({
                                                    ...reviewForm,
                                                    rating: e.target.value
                                                }),
                                            className: "w-full px-4 py-2 border border-gray-300 rounded",
                                            children: [
                                                /*#__PURE__*/ _jsx("option", {
                                                    value: "5",
                                                    children: "5 Stars"
                                                }),
                                                /*#__PURE__*/ _jsx("option", {
                                                    value: "4",
                                                    children: "4 Stars"
                                                }),
                                                /*#__PURE__*/ _jsx("option", {
                                                    value: "3",
                                                    children: "3 Stars"
                                                }),
                                                /*#__PURE__*/ _jsx("option", {
                                                    value: "2",
                                                    children: "2 Stars"
                                                }),
                                                /*#__PURE__*/ _jsx("option", {
                                                    value: "1",
                                                    children: "1 Star"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("label", {
                                            className: "block text-sm font-medium mb-2",
                                            children: "Title"
                                        }),
                                        /*#__PURE__*/ _jsx("input", {
                                            type: "text",
                                            placeholder: "e.g., Great product!",
                                            value: reviewForm.title,
                                            onChange: (e)=>setReviewForm({
                                                    ...reviewForm,
                                                    title: e.target.value
                                                }),
                                            className: "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("label", {
                                            className: "block text-sm font-medium mb-2",
                                            children: "Review"
                                        }),
                                        /*#__PURE__*/ _jsx("textarea", {
                                            placeholder: "Share your experience...",
                                            rows: 4,
                                            value: reviewForm.comment,
                                            onChange: (e)=>setReviewForm({
                                                    ...reviewForm,
                                                    comment: e.target.value
                                                }),
                                            className: "w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsx("button", {
                                    type: "submit",
                                    className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition",
                                    children: "Submit Review"
                                })
                            ]
                        })
                    }),
                    reviewLoading ? /*#__PURE__*/ _jsx("p", {
                        className: "text-gray-600",
                        children: "Loading reviews..."
                    }) : reviews.length === 0 ? /*#__PURE__*/ _jsx("p", {
                        className: "text-gray-600",
                        children: "No reviews yet. Be the first to review!"
                    }) : /*#__PURE__*/ _jsx("div", {
                        className: "space-y-6",
                        children: reviews.map((review)=>/*#__PURE__*/ _jsxs("div", {
                                className: "border-b pb-6 last:border-b-0",
                                children: [
                                    /*#__PURE__*/ _jsx("div", {
                                        className: "flex justify-between items-start mb-2",
                                        children: /*#__PURE__*/ _jsxs("div", {
                                            children: [
                                                /*#__PURE__*/ _jsx("p", {
                                                    className: "font-semibold",
                                                    children: review.user_name || review.userName || 'Anonymous'
                                                }),
                                                /*#__PURE__*/ _jsxs("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("span", {
                                                            className: "text-yellow-400",
                                                            children: '⭐'.repeat(review.rating)
                                                        }),
                                                        /*#__PURE__*/ _jsx("span", {
                                                            className: "text-xs text-gray-600",
                                                            children: review.created_at || review.createdAt
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    }),
                                    /*#__PURE__*/ _jsx("h4", {
                                        className: "font-bold mb-2",
                                        children: review.title
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "text-gray-700 mb-3",
                                        children: review.review || review.comment
                                    }),
                                    /*#__PURE__*/ _jsxs("button", {
                                        className: "text-sm text-gray-600 hover:text-gray-900",
                                        children: [
                                            "👍 Helpful (",
                                            review.helpful_count || review.helpful || 0,
                                            ")"
                                        ]
                                    })
                                ]
                            }, review.id))
                    })
                ]
            })
        ]
    });
}
