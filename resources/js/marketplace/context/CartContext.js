'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useStorage';
const CartContext = /*#__PURE__*/ createContext(undefined);
export const CartProvider = ({ children })=>{
    const [cartItems, setCartItems] = useLocalStorage('cart', []);
    const calculateTotals = (items)=>{
        const subTotal = items.reduce((sum, item)=>sum + item.price * item.quantity, 0);
        const tax = Math.round(subTotal * 0.1 * 100) / 100;
        const shipping = subTotal > 100 ? 0 : subTotal > 50 ? 5 : 10;
        const total = subTotal + tax + shipping;
        return {
            items,
            subTotal,
            tax,
            shipping,
            total
        };
    };
    const addToCart = useCallback((product, quantity)=>{
        setCartItems((prev)=>{
            const existingItem = prev.find((item)=>item.productId === product.id);
            if (existingItem) {
                return prev.map((item)=>item.productId === product.id ? {
                        ...item,
                        quantity: item.quantity + quantity
                    } : item);
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    quantity,
                    price: product.price,
                    product
                }
            ];
        });
    }, [
        setCartItems
    ]);
    const removeFromCart = useCallback((productId)=>{
        setCartItems((prev)=>prev.filter((item)=>item.productId !== productId));
    }, [
        setCartItems
    ]);
    const updateQuantity = useCallback((productId, quantity)=>{
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prev)=>prev.map((item)=>item.productId === productId ? {
                    ...item,
                    quantity
                } : item));
    }, [
        setCartItems,
        removeFromCart
    ]);
    const clearCart = useCallback(()=>{
        setCartItems([]);
    }, [
        setCartItems
    ]);
    const cart = calculateTotals(cartItems);
    return /*#__PURE__*/ _jsx(CartContext.Provider, {
        value: {
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            itemsCount: cartItems.length
        },
        children: children
    });
};
export const useCart = ()=>{
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
