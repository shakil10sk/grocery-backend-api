'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useStorage';
const WishlistContext = /*#__PURE__*/ createContext(undefined);
export const WishlistProvider = ({ children })=>{
    const [wishlist, setWishlist] = useLocalStorage('wishlist', []);
    const addToWishlist = (product)=>{
        setWishlist((prev)=>{
            if (prev.some((item)=>item.productId === product.id)) {
                return prev;
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    addedAt: new Date().toISOString(),
                    product
                }
            ];
        });
    };
    const removeFromWishlist = (productId)=>{
        setWishlist((prev)=>prev.filter((item)=>item.productId !== productId));
    };
    const isInWishlist = (productId)=>{
        return wishlist.some((item)=>item.productId === productId);
    };
    const clearWishlist = ()=>{
        setWishlist([]);
    };
    return /*#__PURE__*/ _jsx(WishlistContext.Provider, {
        value: {
            wishlist,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            clearWishlist
        },
        children: children
    });
};
export const useWishlist = ()=>{
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};
