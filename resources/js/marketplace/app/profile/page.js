'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
export default function ProfilePage() {
    const { user, isAuthenticated, updateProfile, updatePassword } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    if (!isAuthenticated) {
        return /*#__PURE__*/ _jsxs("div", {
            className: "max-w-7xl mx-auto px-4 py-16 text-center",
            children: [
                /*#__PURE__*/ _jsx("h1", {
                    className: "text-3xl font-bold mb-4",
                    children: "Profile"
                }),
                /*#__PURE__*/ _jsx("p", {
                    className: "text-gray-600 mb-8",
                    children: "Please log in to view your profile"
                }),
                /*#__PURE__*/ _jsx(Link, {
                    href: "/auth/login",
                    className: "text-green-600 hover:underline font-medium",
                    children: "Go to Login →"
                })
            ]
        });
    }
    const handleProfileChange = (e)=>{
        setFormData((prev)=>({
                ...prev,
                [e.target.name]: e.target.value
            }));
    };
    const handlePasswordChange = (e)=>{
        setPasswordData((prev)=>({
                ...prev,
                [e.target.name]: e.target.value
            }));
    };
    const handleProfileSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            await updateProfile(formData);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Failed to update profile');
        } finally{
            setLoading(false);
        }
    };
    const handlePasswordSubmit = async (e)=>{
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        setLoading(true);
        try {
            await updatePassword(passwordData.oldPassword, passwordData.newPassword);
            alert('Password updated successfully!');
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            alert('Failed to update password');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ _jsxs("div", {
        className: "max-w-7xl mx-auto px-4 py-8",
        children: [
            /*#__PURE__*/ _jsx("h1", {
                className: "text-3xl font-bold mb-8",
                children: "My Profile"
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        className: "lg:col-span-1",
                        children: /*#__PURE__*/ _jsxs("div", {
                            className: "bg-white rounded-lg shadow p-6 sticky top-20",
                            children: [
                                /*#__PURE__*/ _jsxs("div", {
                                    className: "text-center mb-6",
                                    children: [
                                        /*#__PURE__*/ _jsx("div", {
                                            className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4",
                                            children: /*#__PURE__*/ _jsx("span", {
                                                className: "text-4xl",
                                                children: "👤"
                                            })
                                        }),
                                        /*#__PURE__*/ _jsx("h2", {
                                            className: "font-bold",
                                            children: user?.name
                                        }),
                                        /*#__PURE__*/ _jsx("p", {
                                            className: "text-sm text-gray-600",
                                            children: user?.email
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ _jsxs("nav", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ _jsx("button", {
                                            onClick: ()=>setActiveTab('profile'),
                                            className: `w-full text-left px-4 py-2 rounded transition ${activeTab === 'profile' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`,
                                            children: "Profile Information"
                                        }),
                                        /*#__PURE__*/ _jsx("button", {
                                            onClick: ()=>setActiveTab('password'),
                                            className: `w-full text-left px-4 py-2 rounded transition ${activeTab === 'password' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`,
                                            children: "Change Password"
                                        }),
                                        /*#__PURE__*/ _jsx("button", {
                                            onClick: ()=>setActiveTab('orders'),
                                            className: `w-full text-left px-4 py-2 rounded transition ${activeTab === 'orders' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`,
                                            children: "Order History"
                                        }),
                                        /*#__PURE__*/ _jsx("button", {
                                            onClick: ()=>setActiveTab('loyalty'),
                                            className: `w-full text-left px-4 py-2 rounded transition ${activeTab === 'loyalty' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`,
                                            children: "Loyalty Points"
                                        }),
                                        /*#__PURE__*/ _jsx("button", {
                                            onClick: ()=>setActiveTab('activity'),
                                            className: `w-full text-left px-4 py-2 rounded transition ${activeTab === 'activity' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`,
                                            children: "Activity Log"
                                        })
                                    ]
                                })
                            ]
                        })
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "lg:col-span-3",
                        children: [
                            activeTab === 'profile' && /*#__PURE__*/ _jsxs("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h2", {
                                        className: "text-2xl font-bold mb-6",
                                        children: "Profile Information"
                                    }),
                                    /*#__PURE__*/ _jsxs("form", {
                                        onSubmit: handleProfileSubmit,
                                        className: "space-y-4",
                                        children: [
                                            /*#__PURE__*/ _jsxs("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsx("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Full Name"
                                                    }),
                                                    /*#__PURE__*/ _jsx("input", {
                                                        type: "text",
                                                        name: "name",
                                                        value: formData.name,
                                                        onChange: handleProfileChange,
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsxs("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsx("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Email"
                                                    }),
                                                    /*#__PURE__*/ _jsx("input", {
                                                        type: "email",
                                                        name: "email",
                                                        value: formData.email,
                                                        onChange: handleProfileChange,
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsxs("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsx("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Phone"
                                                    }),
                                                    /*#__PURE__*/ _jsx("input", {
                                                        type: "tel",
                                                        name: "phone",
                                                        value: formData.phone,
                                                        onChange: handleProfileChange,
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsx("button", {
                                                type: "submit",
                                                disabled: loading,
                                                className: "px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400",
                                                children: loading ? 'Saving...' : 'Save Changes'
                                            })
                                        ]
                                    })
                                ]
                            }),
                            activeTab === 'password' && /*#__PURE__*/ _jsxs("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h2", {
                                        className: "text-2xl font-bold mb-6",
                                        children: "Change Password"
                                    }),
                                    /*#__PURE__*/ _jsxs("form", {
                                        onSubmit: handlePasswordSubmit,
                                        className: "space-y-4 max-w-md",
                                        children: [
                                            /*#__PURE__*/ _jsxs("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsx("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Current Password"
                                                    }),
                                                    /*#__PURE__*/ _jsx("input", {
                                                        type: "password",
                                                        name: "oldPassword",
                                                        value: passwordData.oldPassword,
                                                        onChange: handlePasswordChange,
                                                        required: true,
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsxs("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsx("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "New Password"
                                                    }),
                                                    /*#__PURE__*/ _jsx("input", {
                                                        type: "password",
                                                        name: "newPassword",
                                                        value: passwordData.newPassword,
                                                        onChange: handlePasswordChange,
                                                        required: true,
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsxs("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsx("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Confirm Password"
                                                    }),
                                                    /*#__PURE__*/ _jsx("input", {
                                                        type: "password",
                                                        name: "confirmPassword",
                                                        value: passwordData.confirmPassword,
                                                        onChange: handlePasswordChange,
                                                        required: true,
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsx("button", {
                                                type: "submit",
                                                disabled: loading,
                                                className: "px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400",
                                                children: loading ? 'Updating...' : 'Update Password'
                                            })
                                        ]
                                    })
                                ]
                            }),
                            activeTab === 'orders' && /*#__PURE__*/ _jsxs("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h2", {
                                        className: "text-2xl font-bold mb-6",
                                        children: "Order History"
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "text-center py-8",
                                        children: [
                                            /*#__PURE__*/ _jsx("p", {
                                                className: "text-gray-600",
                                                children: "No orders yet"
                                            }),
                                            /*#__PURE__*/ _jsx(Link, {
                                                href: "/products",
                                                className: "text-green-600 hover:underline mt-2 block",
                                                children: "Start Shopping →"
                                            })
                                        ]
                                    })
                                ]
                            }),
                            activeTab === 'loyalty' && /*#__PURE__*/ _jsxs("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h2", {
                                        className: "text-2xl font-bold mb-6",
                                        children: "Loyalty Points"
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "grid grid-cols-2 gap-4 mb-6",
                                        children: [
                                            /*#__PURE__*/ _jsxs("div", {
                                                className: "bg-green-50 p-4 rounded-lg",
                                                children: [
                                                    /*#__PURE__*/ _jsx("p", {
                                                        className: "text-gray-600 text-sm",
                                                        children: "Total Points"
                                                    }),
                                                    /*#__PURE__*/ _jsx("p", {
                                                        className: "text-3xl font-bold text-green-600",
                                                        children: "0"
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ _jsxs("div", {
                                                className: "bg-blue-50 p-4 rounded-lg",
                                                children: [
                                                    /*#__PURE__*/ _jsx("p", {
                                                        className: "text-gray-600 text-sm",
                                                        children: "Your Tier"
                                                    }),
                                                    /*#__PURE__*/ _jsx("p", {
                                                        className: "text-3xl font-bold text-blue-600",
                                                        children: "Bronze"
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "text-gray-600",
                                        children: "Start earning points by making purchases!"
                                    })
                                ]
                            }),
                            activeTab === 'activity' && /*#__PURE__*/ _jsxs("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h2", {
                                        className: "text-2xl font-bold mb-6",
                                        children: "Activity Log"
                                    }),
                                    /*#__PURE__*/ _jsx("div", {
                                        className: "text-center py-8",
                                        children: /*#__PURE__*/ _jsx("p", {
                                            className: "text-gray-600",
                                            children: "No activity yet"
                                        })
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
