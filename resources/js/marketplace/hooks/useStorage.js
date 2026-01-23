import { useCallback, useState } from 'react';
export const useLocalStorage = (key, initialValue)=>{
    const [storedValue, setStoredValue] = useState(()=>{
        try {
            if (typeof window === 'undefined') {
                return initialValue;
            }
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });
    const setValue = useCallback((value)=>{
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    }, [
        key,
        storedValue
    ]);
    return [
        storedValue,
        setValue
    ];
};
export const useSessionStorage = (key, initialValue)=>{
    const [storedValue, setStoredValue] = useState(()=>{
        try {
            if (typeof window === 'undefined') {
                return initialValue;
            }
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });
    const setValue = useCallback((value)=>{
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (typeof window !== 'undefined') {
                window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    }, [
        key,
        storedValue
    ]);
    return [
        storedValue,
        setValue
    ];
};
