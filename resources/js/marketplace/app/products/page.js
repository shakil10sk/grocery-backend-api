'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/products/ProductCard';
import { productService, categoryService } from '../../services/product';
export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('newest');
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // Fetch categories
    useEffect(()=>{
        const fetchCategories = async ()=>{
            try {
                const response = await categoryService.getAllCategories();
                setCategories(response.data.data || []);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);
    // Fetch products
    useEffect(()=>{
        fetchProducts();
    }, [
        filter,
        sort,
        page
    ]);
    const fetchProducts = async ()=>{
        try {
            setLoading(true);
            setError(null);
            const filters = {
                sort,
                page,
                limit: 12
            };
            if (filter !== 'all') {
                filters.category = filter;
            }
            const response = await productService.getAllProducts(filters);
            const data = response.data.data || response.data;
            // Transform API response to Product type
            const transformed = (Array.isArray(data) ? data : data.products || []).map((p)=>({
                    id: String(p.id),
                    name: p.name,
                    description: p.description,
                    price: parseFloat(p.price),
                    originalPrice: p.original_price ? parseFloat(p.original_price) : undefined,
                    discount: p.discount ? parseInt(p.discount) : 0,
                    category: p.category?.name || 'Uncategorized',
                    images: (p.images || []).map((img)=>img.image_url || img.url),
                    thumbnail: p.thumbnail_url || p.images?.[0]?.image_url || 'https://via.placeholder.com/400',
                    rating: parseFloat(p.rating || 0),
                    reviews: p.reviews_count || 0,
                    stock: p.stock || 0,
                    sku: p.sku || '',
                    tags: p.tags || [],
                    createdAt: p.created_at || new Date().toISOString(),
                    updatedAt: p.updated_at || new Date().toISOString()
                }));
            setProducts(transformed);
            // Update pagination info if available
            if (response.data.meta) {
                setTotalPages(response.data.meta.last_page || 1);
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError(err.message || 'Failed to load products');
            setProducts([]);
        } finally{
            setLoading(false);
        }
    };
    const handleCategoryChange = (category)=>{
        setFilter(category);
        setPage(1); // Reset to first page when changing category
    };
    return /*#__PURE__*/ _jsxs("div", {
        className: "max-w-7xl mx-auto px-4 py-8",
        children: [
            /*#__PURE__*/ _jsx("h1", {
                className: "text-3xl font-bold mb-8",
                children: "All Products"
            }),
            error && /*#__PURE__*/ _jsx("div", {
                className: "mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded",
                children: error
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "flex flex-col lg:flex-row gap-8 mb-8",
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        className: "lg:w-64",
                        children: /*#__PURE__*/ _jsxs("div", {
                            className: "bg-white rounded-lg shadow p-6 sticky top-20",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ _jsx("h3", {
                                            className: "font-bold mb-3",
                                            children: "Category"
                                        }),
                                        /*#__PURE__*/ _jsxs("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ _jsxs("label", {
                                                    className: "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("input", {
                                                            type: "radio",
                                                            name: "category",
                                                            value: "all",
                                                            checked: filter === 'all',
                                                            onChange: (e)=>handleCategoryChange(e.target.value),
                                                            className: "mr-2"
                                                        }),
                                                        "All Products"
                                                    ]
                                                }),
                                                categories.map((cat)=>/*#__PURE__*/ _jsxs("label", {
                                                        className: "flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ _jsx("input", {
                                                                type: "radio",
                                                                name: "category",
                                                                value: String(cat.id),
                                                                checked: filter === String(cat.id),
                                                                onChange: (e)=>handleCategoryChange(e.target.value),
                                                                className: "mr-2"
                                                            }),
                                                            cat.name
                                                        ]
                                                    }, cat.id))
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("div", {
                                    children: [
                                        /*#__PURE__*/ _jsx("h3", {
                                            className: "font-bold mb-3",
                                            children: "Rating"
                                        }),
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "space-y-2",
                                            children: [
                                                5,
                                                4,
                                                3,
                                                2,
                                                1
                                            ].map((rating)=>/*#__PURE__*/ _jsxs("label", {
                                                    className: "flex items-center",
                                                    children: [
                                                        /*#__PURE__*/ _jsx("input", {
                                                            type: "checkbox",
                                                            className: "mr-2"
                                                        }),
                                                        '⭐'.repeat(rating),
                                                        " ",
                                                        rating,
                                                        " Star"
                                                    ]
                                                }, rating))
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "flex-1",
                        children: [
                            /*#__PURE__*/ _jsxs("div", {
                                className: "flex justify-between items-center mb-6",
                                children: [
                                    /*#__PURE__*/ _jsxs("p", {
                                        className: "text-gray-600",
                                        children: [
                                            "Showing ",
                                            products.length > 0 ? (page - 1) * 12 + 1 : 0,
                                            " -",
                                            ' ',
                                            Math.min(page * 12, (page - 1) * 12 + products.length),
                                            " products"
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsxs("select", {
                                        value: sort,
                                        onChange: (e)=>{
                                            setSort(e.target.value);
                                            setPage(1);
                                        },
                                        className: "border border-gray-300 rounded px-4 py-2",
                                        children: [
                                            /*#__PURE__*/ _jsx("option", {
                                                value: "newest",
                                                children: "Newest"
                                            }),
                                            /*#__PURE__*/ _jsx("option", {
                                                value: "popular",
                                                children: "Most Popular"
                                            }),
                                            /*#__PURE__*/ _jsx("option", {
                                                value: "price-low",
                                                children: "Price: Low to High"
                                            }),
                                            /*#__PURE__*/ _jsx("option", {
                                                value: "price-high",
                                                children: "Price: High to Low"
                                            }),
                                            /*#__PURE__*/ _jsx("option", {
                                                value: "rating",
                                                children: "Highest Rated"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            loading ? /*#__PURE__*/ _jsx("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
                                children: [
                                    ...Array(6)
                                ].map((_, i)=>/*#__PURE__*/ _jsx("div", {
                                        className: "bg-gray-200 rounded-lg h-80 animate-pulse"
                                    }, i))
                            }) : products.length === 0 ? /*#__PURE__*/ _jsx("div", {
                                className: "text-center py-12",
                                children: /*#__PURE__*/ _jsx("p", {
                                    className: "text-gray-600 text-lg",
                                    children: "No products found."
                                })
                            }) : /*#__PURE__*/ _jsxs(_Fragment, {
                                children: [
                                    /*#__PURE__*/ _jsx("div", {
                                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
                                        children: products.map((product)=>/*#__PURE__*/ _jsx(ProductCard, {
                                                product: product
                                            }, product.id))
                                    }),
                                    totalPages > 1 && /*#__PURE__*/ _jsx("div", {
                                        className: "flex justify-center gap-2 mt-8",
                                        children: [
                                            ...Array(totalPages)
                                        ].map((_, i)=>/*#__PURE__*/ _jsx("button", {
                                                onClick: ()=>setPage(i + 1),
                                                className: `px-4 py-2 rounded transition ${page === i + 1 ? 'bg-green-600 text-white' : 'border border-gray-300 hover:border-green-600'}`,
                                                children: i + 1
                                            }, i + 1))
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        ]
    });
}
