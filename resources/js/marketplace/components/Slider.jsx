import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { sliderService } from '../services/product';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeSlider = () => {
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const response = await sliderService.getSliders();
                // Handle various response structures
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

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: false, // Cleaner look
    };

    if (loading) {
        return <div className="h-64 md:h-96 bg-gray-200 animate-pulse rounded-xl" />;
    }

    if (slides.length === 0) {
        return null;
    }

    return (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <Slider {...settings}>
                {slides.map((slide) => (
                    <div key={slide.id} className="relative h-64 md:h-96 outline-none">
                        {/* Fallback to gray background if no image */}
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url(${slide.image_url || slide.image})`,
                                backgroundColor: '#e5e7eb'
                            }}
                        >
                            <div className="absolute inset-0 bg-black/20 flex flex-col justify-center px-8 md:px-16 text-white">
                                {slide.title && <h2 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h2>}
                                {slide.description && <p className="text-lg md:text-xl max-w-2xl">{slide.description}</p>}
                                {slide.button_text && slide.button_url && (
                                    <a
                                        href={slide.button_url}
                                        className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors w-fit"
                                    >
                                        {slide.button_text}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HomeSlider;
