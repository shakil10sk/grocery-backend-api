'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();
    const handleChange = (e)=>{
        setFormData((prev)=>({
                ...prev,
                [e.target.name]: e.target.value
            }));
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        setLoading(true);
        try {
            await signup({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            navigate('/profile');
        } catch (error) {
            alert('Signup failed. Please try again.');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ _jsx("div", {
        className: "min-h-screen bg-gray-50 flex items-center justify-center px-4",
        children: /*#__PURE__*/ _jsxs("div", {
            className: "max-w-md w-full bg-white rounded-lg shadow p-8",
            children: [
                /*#__PURE__*/ _jsx("h1", {
                    className: "text-3xl font-bold text-center mb-8",
                    children: "Create Account"
                }),
                /*#__PURE__*/ _jsxs("form", {
                    onSubmit: handleSubmit,
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
                                    onChange: handleChange,
                                    required: true,
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
                                    onChange: handleChange,
                                    required: true,
                                    className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            children: [
                                /*#__PURE__*/ _jsx("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-2",
                                    children: "Password"
                                }),
                                /*#__PURE__*/ _jsx("input", {
                                    type: "password",
                                    name: "password",
                                    value: formData.password,
                                    onChange: handleChange,
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
                                    value: formData.confirmPassword,
                                    onChange: handleChange,
                                    required: true,
                                    className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsx("button", {
                            type: "submit",
                            disabled: loading,
                            className: "w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 font-medium",
                            children: loading ? 'Creating Account...' : 'Sign Up'
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs("p", {
                    className: "text-center text-gray-600 mt-6",
                    children: [
                        "Already have an account?",
                        ' ',
                        /*#__PURE__*/ _jsx(Link, {
                            href: "/auth/login",
                            className: "text-green-600 hover:underline font-medium",
                            children: "Login"
                        })
                    ]
                })
            ]
        })
    });
}
