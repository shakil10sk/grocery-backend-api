'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useStorage';
const AuthContext = /*#__PURE__*/ createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useLocalStorage('token', null);
    const [user, setUser] = useLocalStorage('user', null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const login = useCallback(async (email, password) => {
        try {
            setLoading(true);
            const response = await fetch('/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Handle both direct response and nested data format from backend
            const userData = data.data || data;

            // Expected backend response: { data: { user: {...}, token: "...", token_type: "bearer" } }
            // So userData might be { user: {...}, token: "..." }

            setToken(userData.token);
            setUser(userData.user);
            setError(undefined);
            return userData;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setToken, setUser]);
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        setError(undefined);
        // Clear all auth-related keys from localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [
        setToken,
        setUser
    ]);
    // Renaming signup to register to match usage in Register.jsx and backend convention
    const register = useCallback(async (userData) => {
        try {
            setLoading(true);
            const response = await fetch('/api/v1/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    password_confirmation: userData.password_confirmation,
                    phone: userData.phone,
                    role: userData.role || 'customer'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Format validation errors if available
                if (response.status === 422 && data.errors) {
                    const firstError = Object.values(data.errors).flat()[0];
                    throw new Error(firstError || data.message || 'Registration failed');
                }
                throw new Error(data.message || 'Registration failed');
            }

            // Handle both direct response and nested data format from backend
            const responseData = data.data || data;

            setToken(responseData.token);
            setUser(responseData.user);
            setError(undefined);
            return responseData;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [setToken, setUser]);
    const updateProfile = useCallback(async (userData) => {
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
        } finally {
            setLoading(false);
        }
    }, [
        token,
        setUser
    ]);
    const updatePassword = useCallback(async (oldPassword, newPassword) => {
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
        } finally {
            setLoading(false);
        }
    }, [
        token
    ]);
    return /*#__PURE__*/ _jsx(AuthContext.Provider, {
        value: {
            isAuthenticated: !!user && !!token,
            user: user || undefined,
            token: token || undefined,
            loading,
            error,
            login,
            logout,
            register, // Expose register instead of signup
            updateProfile,
            updatePassword
        },
        children: children
    });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
