import React from 'react';

const PromotionalCards = () => {
    const cards = [
        {
            title: 'Local Artisans',
            subtitle: 'Handcrafted with care',
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
            badge: 'New',
            badgeColor: 'bg-yellow-400',
        },
        {
            title: 'Weekly Essentials',
            subtitle: 'Stock up & save',
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400',
            badge: null,
        },
        {
            title: 'Flash Sales',
            subtitle: 'Up to 50% off today',
            image: 'https://images.unsplash.com/photo-1506484334402-40f215039273?auto=format&fit=crop&q=80&w=400',
            badge: 'Hot',
            badgeColor: 'bg-orange-500',
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {cards.map((card, index) => (
                <div key={index} className="relative group overflow-hidden rounded-2xl h-48 cursor-pointer">
                    <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                        {card.badge && (
                            <span className={`absolute top-4 right-4 ${card.badgeColor || 'bg-green-500'} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                                {card.badge}
                            </span>
                        )}
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">{card.title}</h3>
                        <p className="text-white/80 text-sm group-hover:translate-x-1 transition-transform delay-75">{card.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PromotionalCards;
