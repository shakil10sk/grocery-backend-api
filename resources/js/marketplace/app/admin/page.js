'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    return /*#__PURE__*/ _jsx("div", {
        className: "min-h-screen bg-gray-100",
        children: /*#__PURE__*/ _jsxs("div", {
            className: "max-w-7xl mx-auto px-4 py-8",
            children: [
                /*#__PURE__*/ _jsx("div", {
                    className: "bg-white rounded-lg shadow p-6 mb-8",
                    children: /*#__PURE__*/ _jsxs("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ _jsx("h1", {
                                className: "text-3xl font-bold",
                                children: "Admin Dashboard"
                            }),
                            /*#__PURE__*/ _jsx(Link, {
                                href: "/",
                                className: "text-green-600 hover:underline",
                                children: "Back to Store"
                            })
                        ]
                    })
                }),
                /*#__PURE__*/ _jsx("div", {
                    className: "bg-white rounded-lg shadow mb-8",
                    children: /*#__PURE__*/ _jsx("div", {
                        className: "flex flex-wrap",
                        children: [
                            {
                                id: 'overview',
                                label: 'Overview'
                            },
                            {
                                id: 'featured',
                                label: 'Featured Products'
                            },
                            {
                                id: 'best-selling',
                                label: 'Best Selling'
                            },
                            {
                                id: 'interested',
                                label: 'Most Interested'
                            },
                            {
                                id: 'seasonal',
                                label: 'Seasonal'
                            }
                        ].map((tab)=>/*#__PURE__*/ _jsx("button", {
                                onClick: ()=>setActiveTab(tab.id),
                                className: `flex-1 px-4 py-4 font-medium border-b-2 transition ${activeTab === tab.id ? 'border-green-600 text-green-600' : 'border-transparent text-gray-600 hover:text-gray-900'}`,
                                children: tab.label
                            }, tab.id))
                    })
                }),
                activeTab === 'overview' && /*#__PURE__*/ _jsxs("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ _jsx("div", {
                            className: "grid grid-cols-1 md:grid-cols-4 gap-6",
                            children: [
                                {
                                    label: 'Total Sales',
                                    value: '$45,231',
                                    icon: '💰'
                                },
                                {
                                    label: 'Orders',
                                    value: '1,234',
                                    icon: '📦'
                                },
                                {
                                    label: 'Products',
                                    value: '567',
                                    icon: '🛍️'
                                },
                                {
                                    label: 'Customers',
                                    value: '2,890',
                                    icon: '👥'
                                }
                            ].map((stat, idx)=>/*#__PURE__*/ _jsxs("div", {
                                    className: "bg-white rounded-lg shadow p-6",
                                    children: [
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "text-4xl mb-2",
                                            children: stat.icon
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "text-gray-600 text-sm mb-2",
                                            children: stat.label
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "text-2xl font-bold",
                                            children: stat.value
                                        })
                                    ]
                                }, idx))
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                            children: [
                                /*#__PURE__*/ _jsx("div", {
                                    className: "bg-white rounded-lg shadow p-6 h-80 flex items-center justify-center",
                                    children: /*#__PURE__*/ _jsx("p", {
                                        className: "text-gray-600",
                                        children: "Sales Chart (Placeholder)"
                                    })
                                }),
                                /*#__PURE__*/ _jsx("div", {
                                    className: "bg-white rounded-lg shadow p-6 h-80 flex items-center justify-center",
                                    children: /*#__PURE__*/ _jsx("p", {
                                        className: "text-gray-600",
                                        children: "Top Products (Placeholder)"
                                    })
                                })
                            ]
                        })
                    ]
                }),
                activeTab === 'featured' && /*#__PURE__*/ _jsxs("div", {
                    className: "bg-white rounded-lg shadow p-6",
                    children: [
                        /*#__PURE__*/ _jsx("h2", {
                            className: "text-2xl font-bold mb-6",
                            children: "Featured Products"
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            className: "space-y-4",
                            children: [
                                [
                                    1,
                                    2,
                                    3
                                ].map((item)=>/*#__PURE__*/ _jsxs("div", {
                                        className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50",
                                        children: [
                                            /*#__PURE__*/ _jsxs("div", {
                                                className: "flex items-center gap-4",
                                                children: [
                                                    /*#__PURE__*/ _jsx("div", {
                                                        className: "w-16 h-16 bg-gray-200 rounded"
                                                    }),
                                                    /*#__PURE__*/ _jsxs("div", {
                                                        children: [
                                                            /*#__PURE__*/ _jsxs("p", {
                                                                className: "font-bold",
                                                                children: [
                                                                    "Product ",
                                                                    item
                                                                ]
                                                            }),
                                                            /*#__PURE__*/ _jsx("p", {
                                                                className: "text-sm text-gray-600",
                                                                children: "$12.99"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsxs("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ _jsx("button", {
                                                        className: "px-4 py-2 border border-gray-300 rounded hover:bg-gray-50",
                                                        children: "Edit"
                                                    }),
                                                    /*#__PURE__*/ _jsx("button", {
                                                        className: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",
                                                        children: "Remove"
                                                    })
                                                ]
                                            })
                                        ]
                                    }, item)),
                                /*#__PURE__*/ _jsx("button", {
                                    className: "w-full mt-4 px-4 py-2 border-2 border-green-600 text-green-600 rounded hover:bg-green-50 font-medium",
                                    children: "+ Add Product"
                                })
                            ]
                        })
                    ]
                }),
                activeTab === 'best-selling' && /*#__PURE__*/ _jsxs("div", {
                    className: "bg-white rounded-lg shadow p-6",
                    children: [
                        /*#__PURE__*/ _jsx("h2", {
                            className: "text-2xl font-bold mb-6",
                            children: "Best Selling Products"
                        }),
                        /*#__PURE__*/ _jsxs("table", {
                            className: "w-full",
                            children: [
                                /*#__PURE__*/ _jsx("thead", {
                                    children: /*#__PURE__*/ _jsxs("tr", {
                                        className: "border-b",
                                        children: [
                                            /*#__PURE__*/ _jsx("th", {
                                                className: "text-left p-4",
                                                children: "Product"
                                            }),
                                            /*#__PURE__*/ _jsx("th", {
                                                className: "text-center p-4",
                                                children: "Sales"
                                            }),
                                            /*#__PURE__*/ _jsx("th", {
                                                className: "text-right p-4",
                                                children: "Revenue"
                                            })
                                        ]
                                    })
                                }),
                                /*#__PURE__*/ _jsx("tbody", {
                                    children: [
                                        1,
                                        2,
                                        3,
                                        4,
                                        5
                                    ].map((item)=>/*#__PURE__*/ _jsxs("tr", {
                                            className: "border-b hover:bg-gray-50",
                                            children: [
                                                /*#__PURE__*/ _jsxs("td", {
                                                    className: "p-4",
                                                    children: [
                                                        "Product ",
                                                        item
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("td", {
                                                    className: "p-4 text-center",
                                                    children: [
                                                        100 + item * 10,
                                                        " units"
                                                    ]
                                                }),
                                                /*#__PURE__*/ _jsxs("td", {
                                                    className: "p-4 text-right",
                                                    children: [
                                                        "$",
                                                        (100 + item * 10) * 12.99
                                                    ]
                                                })
                                            ]
                                        }, item))
                                })
                            ]
                        })
                    ]
                }),
                activeTab === 'interested' && /*#__PURE__*/ _jsxs("div", {
                    className: "bg-white rounded-lg shadow p-6",
                    children: [
                        /*#__PURE__*/ _jsx("h2", {
                            className: "text-2xl font-bold mb-6",
                            children: "Most Interested Products"
                        }),
                        /*#__PURE__*/ _jsx("p", {
                            className: "text-gray-600 mb-6",
                            children: "Products with the most customer interest/wishlist adds"
                        }),
                        /*#__PURE__*/ _jsx("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
                            children: [
                                1,
                                2,
                                3,
                                4
                            ].map((item)=>/*#__PURE__*/ _jsxs("div", {
                                    className: "bg-gray-50 rounded-lg p-4 text-center",
                                    children: [
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "w-full h-32 bg-gray-200 rounded mb-3"
                                        }),
                                        /*#__PURE__*/ _jsxs("p", {
                                            className: "font-bold mb-2",
                                            children: [
                                                "Product ",
                                                item
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs("p", {
                                            className: "text-sm text-gray-600",
                                            children: [
                                                "❤️ ",
                                                50 + item * 15,
                                                " Wishlist"
                                            ]
                                        })
                                    ]
                                }, item))
                        })
                    ]
                }),
                activeTab === 'seasonal' && /*#__PURE__*/ _jsxs("div", {
                    className: "bg-white rounded-lg shadow p-6",
                    children: [
                        /*#__PURE__*/ _jsx("h2", {
                            className: "text-2xl font-bold mb-6",
                            children: "Seasonal Products"
                        }),
                        /*#__PURE__*/ _jsx("div", {
                            className: "space-y-4",
                            children: [
                                'Winter',
                                'Spring',
                                'Summer',
                                'Fall'
                            ].map((season)=>/*#__PURE__*/ _jsxs("div", {
                                    className: "p-4 border rounded-lg",
                                    children: [
                                        /*#__PURE__*/ _jsxs("h3", {
                                            className: "font-bold mb-2",
                                            children: [
                                                season,
                                                " Season"
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs("p", {
                                            className: "text-gray-600 mb-3",
                                            children: [
                                                "Manage ",
                                                season.toLowerCase(),
                                                " seasonal products"
                                            ]
                                        }),
                                        /*#__PURE__*/ _jsxs("button", {
                                            className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700",
                                            children: [
                                                "Edit ",
                                                season,
                                                " Products"
                                            ]
                                        })
                                    ]
                                }, season))
                        })
                    ]
                })
            ]
        })
    });
}
