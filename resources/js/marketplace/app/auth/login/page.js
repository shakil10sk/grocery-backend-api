'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const searchParams = useSearchParams();
    React.useEffect(()=>{
        const emailFromQuery = searchParams?.get('email');
        if (emailFromQuery) setEmail(emailFromQuery);
    }, [
        searchParams
    ]);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/profile');
        } catch (error) {
            alert('Login failed. Please try again.');
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
                    children: "Welcome Back"
                }),
                /*#__PURE__*/ _jsxs("form", {
                    onSubmit: handleSubmit,
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ _jsxs("div", {
                            children: [
                                /*#__PURE__*/ _jsx("label", {
                                    className: "block text-sm font-medium text-gray-700 mb-2",
                                    children: "Email"
                                }),
                                /*#__PURE__*/ _jsx("input", {
                                    type: "email",
                                    value: email,
                                    onChange: (e)=>setEmail(e.target.value),
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
                                    value: password,
                                    onChange: (e)=>setPassword(e.target.value),
                                    required: true,
                                    className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                })
                            ]
                        }),
                        /*#__PURE__*/ _jsx("button", {
                            type: "submit",
                            disabled: loading,
                            className: "w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 font-medium",
                            children: loading ? 'Logging in...' : 'Login'
                        })
                    ]
                }),
                /*#__PURE__*/ _jsxs("p", {
                    className: "text-center text-gray-600 mt-6",
                    children: [
                        "Don't have an account?",
                        ' ',
                        /*#__PURE__*/ _jsx(Link, {
                            href: "/auth/signup",
                            className: "text-green-600 hover:underline font-medium",
                            children: "Sign up"
                        })
                    ]
                })
            ]
        })
    });
}
