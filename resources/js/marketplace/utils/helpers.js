export const formatPrice = (price)=>{
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};
export const calculateDiscount = (originalPrice, currentPrice)=>{
    return Math.round((originalPrice - currentPrice) / originalPrice * 100);
};
export const truncateText = (text, length)=>{
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};
export const slugify = (text)=>{
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '');
};
export const getInitials = (name)=>{
    return name.split(' ').map((part)=>part[0]).join('').toUpperCase();
};
export const formatDate = (date)=>{
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
export const calculateTax = (amount, taxRate = 0.1)=>{
    return Math.round(amount * taxRate * 100) / 100;
};
export const calculateShipping = (amount)=>{
    if (amount > 100) return 0; // Free shipping
    if (amount > 50) return 5;
    return 10;
};
export const validateEmail = (email)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
export const generateOrderNumber = ()=>{
    return 'ORD-' + Date.now().toString().slice(-10);
};
export const getRandomArray = (array, count)=>{
    const shuffled = [
        ...array
    ].sort(()=>0.5 - Math.random());
    return shuffled.slice(0, count);
};
