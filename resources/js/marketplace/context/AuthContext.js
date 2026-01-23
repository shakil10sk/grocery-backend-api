'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useStorage';
const AuthContext = /*#__PURE__*/ createContext(undefined);
export const AuthProvider = ({ children })=>{
    const [token, setToken] = useLocalStorage('token', null);
    const [user, setUser] = useLocalStorage('user', null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const login = useCallback(async (email, password)=>{
        try {
            setLoading(true);
            // Mock API call - Replace with actual API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            if (!response.ok) throw new Error('Login failed');
            const data = await response.json();
            // Handle both direct response and nested data format from backend
            const userData = data.data || data;
            setToken(userData.token);
            setUser(userData.user);
            setError(undefined);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            throw err;
        } finally{
            setLoading(false);
        }
    }, [
        setToken,
        setUser
    ]);
    const logout = useCallback(()=>{
        setToken(null);
        setUser(null);
        setError(undefined);
    }, [
        setToken,
        setUser
    ]);
    const signup = useCallback(async (userData)=>{
        try {
            setLoading(true);
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: userData.name || '',
                    email: userData.email || '',
                    password: userData.password,
                    password_confirmation: userData.password,
                    phone: userData.phone || '',
                    role: 'customer'
                })
            });
            if (!response.ok) throw new Error('Signup failed');
            const data = await response.json();
            // Handle both direct response and nested data format from backend
            const responseData = data.data || data;
            setToken(responseData.token);
            setUser(responseData.user);
            setError(undefined);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
            throw err;
        } finally{
            setLoading(false);
        }
    }, [
        setToken,
        setUser
    ]);
    const updateProfile = useCallback(async (userData)=>{
        try {
            setLoading(true);
            const response = await fetch('/api/profile/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error('Update failed');
            const data = await response.json();
            setUser(data.user);
            setError(undefined);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Update failed');
            throw err;
        } finally{
            setLoading(false);
        }
    }, [
        token,
        setUser
    ]);
    const updatePassword = useCallback(async (oldPassword, newPassword)=>{
        try {
            setLoading(true);
            const response = await fetch('/api/profile/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    oldPassword,
                    newPassword
                })
            });
            if (!response.ok) throw new Error('Password update failed');
            setError(undefined);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Password update failed');
            throw err;
        } finally{
            setLoading(false);
        }
    }, [
        token
    ]);
    return /*#__PURE__*/ _jsx(AuthContext.Provider, {
        value: {
            isAuthenticated: !!user,
            user: user || undefined,
            token: token || undefined,
            loading,
            error,
            login,
            logout,
            signup,
            updateProfile,
            updatePassword
        },
        children: children
    });
};
export const useAuth = ()=>{
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
