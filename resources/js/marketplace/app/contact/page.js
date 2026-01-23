'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [contactSettings, setContactSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState(null);
    useEffect(()=>{
        fetchContactSettings();
    }, []);
    const fetchContactSettings = async ()=>{
        try {
            setLoading(true);
            const response = await api.get('/settings/contact');
            setContactSettings(response.data.data || response.data);
        } catch (err) {
            console.error('Failed to fetch contact settings:', err);
            // Use default fallback
            setContactSettings({
                company_name: 'GroceryMart',
                company_email: 'support@grocerymart.com',
                company_phone: '1-800-GROCERY (1-800-476-2379)',
                company_address: '123 Market Street, New York, NY 10001'
            });
        } finally{
            setLoading(false);
        }
    };
    const handleChange = (e)=>{
        setFormData((prev)=>({
                ...prev,
                [e.target.name]: e.target.value
            }));
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setSubmitMessage('Please fill in all required fields');
            return;
        }
        try {
            setSubmitting(true);
            // Submit contact form to backend
            await api.post('/contact', formData);
            setSubmitMessage('Message sent successfully! We will get back to you soon.');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
            setTimeout(()=>setSubmitMessage(null), 5000);
        } catch (err) {
            console.error('Failed to send message:', err);
            setSubmitMessage('Failed to send message. Please try again.');
        } finally{
            setSubmitting(false);
        }
    };
    const email = contactSettings?.company_email || contactSettings?.email;
    const phone = contactSettings?.company_phone || contactSettings?.phone;
    const address = contactSettings?.company_address || contactSettings?.address;
    return /*#__PURE__*/ _jsxs("div", {
        className: "max-w-7xl mx-auto px-4 py-8",
        children: [
            /*#__PURE__*/ _jsx("h1", {
                className: "text-3xl font-bold mb-4",
                children: "Contact Us"
            }),
            /*#__PURE__*/ _jsx("p", {
                className: "text-gray-600 mb-8",
                children: "Have questions? We'd love to hear from you. Send us a message!"
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                children: [
                    loading ? /*#__PURE__*/ _jsx("div", {
                        className: "space-y-6 lg:col-span-1",
                        children: [
                            ...Array(4)
                        ].map((_, i)=>/*#__PURE__*/ _jsx("div", {
                                className: "bg-gray-200 rounded-lg h-24 animate-pulse"
                            }, i))
                    }) : /*#__PURE__*/ _jsxs("div", {
                        className: "space-y-6",
                        children: [
                            email && /*#__PURE__*/ _jsxs("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h3", {
                                        className: "text-lg font-bold mb-4",
                                        children: "📧 Email"
                                    }),
                                    /*#__PURE__*/ _jsx("a", {
                                        href: `mailto:${email}`,
                                        className: "text-gray-600 hover:text-green-600",
                                        children: email
                                    })
                                ]
                            }),
                            phone && /*#__PURE__*/ _jsxs("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h3", {
                                        className: "text-lg font-bold mb-4",
                                        children: "📞 Phone"
                                    }),
                                    /*#__PURE__*/ _jsx("a", {
                                        href: `tel:${phone}`,
                                        className: "text-gray-600 hover:text-green-600",
                                        children: phone
                                    })
                                ]
                            }),
                            address && /*#__PURE__*/ _jsxs("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h3", {
                                        className: "text-lg font-bold mb-4",
                                        children: "📍 Address"
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "text-gray-600",
                                        children: address
                                    })
                                ]
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "bg-white rounded-lg shadow p-6",
                                children: [
                                    /*#__PURE__*/ _jsx("h3", {
                                        className: "text-lg font-bold mb-4",
                                        children: "🕐 Hours"
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "text-gray-600",
                                        children: "Mon-Fri: 8 AM - 8 PM"
                                    }),
                                    /*#__PURE__*/ _jsx("p", {
                                        className: "text-gray-600",
                                        children: "Sat-Sun: 9 AM - 6 PM"
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("form", {
                        onSubmit: handleSubmit,
                        className: "lg:col-span-2 bg-white rounded-lg shadow p-6",
                        children: [
                            submitMessage && /*#__PURE__*/ _jsx("div", {
                                className: `mb-4 p-4 rounded ${submitMessage.includes('successfully') ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`,
                                children: submitMessage
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ _jsxs("div", {
                                        children: [
                                            /*#__PURE__*/ _jsx("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: "Name *"
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
                                        className: "grid grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ _jsxs("div", {
                                                children: [
                                                    /*#__PURE__*/ _jsx("label", {
                                                        className: "block text-sm font-medium text-gray-700 mb-2",
                                                        children: "Email *"
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
                                                        children: "Phone"
                                                    }),
                                                    /*#__PURE__*/ _jsx("input", {
                                                        type: "tel",
                                                        name: "phone",
                                                        value: formData.phone,
                                                        onChange: handleChange,
                                                        className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        children: [
                                            /*#__PURE__*/ _jsx("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: "Subject"
                                            }),
                                            /*#__PURE__*/ _jsx("input", {
                                                type: "text",
                                                name: "subject",
                                                value: formData.subject,
                                                onChange: handleChange,
                                                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsxs("div", {
                                        children: [
                                            /*#__PURE__*/ _jsx("label", {
                                                className: "block text-sm font-medium text-gray-700 mb-2",
                                                children: "Message *"
                                            }),
                                            /*#__PURE__*/ _jsx("textarea", {
                                                name: "message",
                                                value: formData.message,
                                                onChange: handleChange,
                                                required: true,
                                                rows: 5,
                                                className: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500",
                                                placeholder: "Tell us how we can help..."
                                            })
                                        ]
                                    }),
                                    /*#__PURE__*/ _jsx("button", {
                                        type: "submit",
                                        disabled: submitting || loading,
                                        className: "w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold disabled:opacity-50",
                                        children: submitting ? 'Sending...' : 'Send Message'
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
