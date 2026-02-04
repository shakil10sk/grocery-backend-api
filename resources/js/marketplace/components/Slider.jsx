import React, { useEffect, useState, useRef } from 'react';
import { sliderService } from '../services/product';

const HomeSlider = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const autoPlayRef = useRef(null);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const response = await sliderService.getSliders();
                const data = response.data.data || response.data || [];
                setSlides(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to load sliders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSliders();
    }, []);

    // Auto-play functionality
    useEffect(() => {
        if (slides.length > 0) {
            autoPlayRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);

            return () => {
                if (autoPlayRef.current) {
                    clearInterval(autoPlayRef.current);
                }
            };
        }
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        // Reset auto-play timer
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
            autoPlayRef.current = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
        }
    };

    const nextSlide = () => {
        goToSlide((currentSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    };

    if (loading) {
        return (
            <div className="relative w-full h-[200px] sm:h-[300px] md:h-[380px] lg:h-[450px] bg-gray-200 animate-pulse rounded-xl overflow-hidden" />
        );
    }

    if (slides.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full h-[200px] sm:h-[300px] md:h-[380px] lg:h-[450px] rounded-xl overflow-hidden shadow-lg mb-6">
            {/* Slides */}
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {/* Background Image */}
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${slide.image_url || slide.image})`,
                                backgroundColor: '#e5e7eb'
                            }}
                        >
                            {/* Overlay */}
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"
                                style={{
                                    opacity: slide.overlay_opacity || 0.5
                                }}
                            />

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24">
                                <div className="max-w-2xl">
                                    {/* Badge */}
                                    {slide.link_text && (
                                        <div className="inline-block px-3 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full mb-4">
                                            {slide.link_text}
                                        </div>
                                    )}

                                    {/* Title */}
                                    {slide.title && (
                                        <h2
                                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                                            style={{ color: slide.text_overlay_color || '#ffffff' }}
                                        >
                                            {slide.title}
                                        </h2>
                                    )}

                                    {/* Description */}
                                    {slide.description && (
                                        <p
                                            className="text-base sm:text-lg md:text-xl text-white/90 mb-6 leading-relaxed"
                                            style={{ color: slide.text_overlay_color || '#ffffff' }}
                                        >
                                            {slide.description}
                                        </p>
                                    )}

                                    {/* CTA Button */}
                                    {slide.link_url && (
                                        <a
                                            href={slide.link_url}
                                            className="inline-block px-6 sm:px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg"
                                            style={{
                                                backgroundColor: slide.button_color || '#059669'
                                            }}
                                        >
                                            Shop Now
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    {/* Previous Button */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all duration-200 group"
                        aria-label="Previous slide"
                    >
                        <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 group-hover:text-emerald-600 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all duration-200 group"
                        aria-label="Next slide"
                    >
                        <svg
                            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 group-hover:text-emerald-600 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Pagination Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${index === currentSlide
                                ? 'bg-white w-6 sm:w-8'
                                : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomeSlider;
