'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { sliderService } from '../../services/product';
export const HeroSlider = ({ slides, autoplay = true, interval = 5000 })=>{
    const [current, setCurrent] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [sliderData, setSliderData] = React.useState([]);
    // Fetch sliders from API if not provided
    useEffect(()=>{
        if (!slides) {
            fetchSliders();
        } else {
            setSliderData(slides);
            setLoading(false);
        }
    }, [
        slides
    ]);
    const fetchSliders = async ()=>{
        try {
            setLoading(true);
            const response = await sliderService.getSliders();
            // Transform backend slider format to UI format
            const transformed = (response.data.data || []).map((slider)=>({
                    id: slider.id,
                    title: slider.title,
                    description: slider.description,
                    image: slider.image_url,
                    link: slider.link_url,
                    linkText: slider.link_text || 'Shop Now',
                    buttonColor: slider.button_color || '#10b981',
                    textColor: slider.text_overlay_color || '#ffffff',
                    overlayOpacity: slider.overlay_opacity || '30'
                }));
            setSliderData(transformed);
        } catch (error) {
            console.error('Failed to fetch sliders:', error);
            // Fallback to default slides
            setSliderData([
                {
                    id: '1',
                    title: 'Fresh Groceries Delivered',
                    image: 'https://images.unsplash.com/photo-1488459716781-6918f33fc177?w=1200&h=400&fit=crop',
                    link: '/categories',
                    linkText: 'Shop Now',
                    buttonColor: '#10b981',
                    textColor: '#ffffff',
                    overlayOpacity: '30'
                },
                {
                    id: '2',
                    title: 'Save Up to 50%',
                    image: 'https://images.unsplash.com/photo-1572710307605-432fadc46723?w=1200&h=400&fit=crop',
                    link: '/products',
                    linkText: 'View Deals',
                    buttonColor: '#10b981',
                    textColor: '#ffffff',
                    overlayOpacity: '30'
                }
            ]);
        } finally{
            setLoading(false);
        }
    };
    // Auto-rotate slides
    useEffect(()=>{
        if (!autoplay || sliderData.length === 0) return;
        const timer = setInterval(()=>{
            setCurrent((prev)=>(prev + 1) % sliderData.length);
        }, interval);
        return ()=>clearInterval(timer);
    }, [
        sliderData.length,
        autoplay,
        interval
    ]);
    if (loading) {
        return /*#__PURE__*/ _jsx("div", {
            className: "relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden animate-pulse",
            children: /*#__PURE__*/ _jsx("div", {
                className: "w-full h-full bg-gradient-to-r from-gray-200 to-gray-300"
            })
        });
    }
    if (sliderData.length === 0) {
        return /*#__PURE__*/ _jsx("div", {
            className: "relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center",
            children: /*#__PURE__*/ _jsx("p", {
                className: "text-gray-500",
                children: "No sliders available"
            })
        });
    }
    const slide = sliderData[current];
    return /*#__PURE__*/ _jsxs("div", {
        className: "relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden group",
        children: [
            sliderData.map((item, index)=>/*#__PURE__*/ _jsxs("div", {
                    className: `absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`,
                    children: [
                        /*#__PURE__*/ _jsx("img", {
                            src: item.image,
                            alt: item.title,
                            className: "w-full h-full object-cover"
                        }),
                        /*#__PURE__*/ _jsx("div", {
                            className: "absolute inset-0 flex flex-col items-center justify-center",
                            style: {
                                backgroundColor: `rgba(0, 0, 0, ${(parseFloat(item.overlayOpacity || '30') / 100).toFixed(2)})`
                            },
                            children: /*#__PURE__*/ _jsxs("div", {
                                className: "text-center px-4",
                                children: [
                                    /*#__PURE__*/ _jsx("h2", {
                                        className: "text-4xl font-bold mb-2",
                                        style: {
                                            color: item.textColor
                                        },
                                        children: item.title
                                    }),
                                    item.description && /*#__PURE__*/ _jsx("p", {
                                        className: "text-lg mb-4",
                                        style: {
                                            color: item.textColor
                                        },
                                        children: item.description
                                    }),
                                    item.link && /*#__PURE__*/ _jsx("a", {
                                        href: item.link,
                                        className: "inline-block px-6 py-2 rounded-lg font-semibold text-white transition hover:opacity-90",
                                        style: {
                                            backgroundColor: item.buttonColor
                                        },
                                        children: item.linkText || 'Shop Now'
                                    })
                                ]
                            })
                        })
                    ]
                }, item.id)),
            sliderData.length > 1 && /*#__PURE__*/ _jsx("div", {
                className: "absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10",
                children: sliderData.map((_, index)=>/*#__PURE__*/ _jsx("button", {
                        onClick: ()=>setCurrent(index),
                        className: `w-3 h-3 rounded-full transition ${index === current ? 'bg-white' : 'bg-white/50'}`,
                        "aria-label": `Slide ${index + 1}`
                    }, index))
            }),
            sliderData.length > 1 && /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx("button", {
                        onClick: ()=>setCurrent((prev)=>(prev - 1 + sliderData.length) % sliderData.length),
                        className: "absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full transition z-10 opacity-0 group-hover:opacity-100",
                        "aria-label": "Previous slide",
                        children: "❮"
                    }),
                    /*#__PURE__*/ _jsx("button", {
                        onClick: ()=>setCurrent((prev)=>(prev + 1) % sliderData.length),
                        className: "absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white p-2 rounded-full transition z-10 opacity-0 group-hover:opacity-100",
                        "aria-label": "Next slide",
                        children: "❯"
                    })
                ]
            })
        ]
    });
};
export default HeroSlider;
