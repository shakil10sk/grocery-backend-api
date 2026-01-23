import { useEffect, useState } from 'react';
export const useFetch = (url, dependencies = [])=>{
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(()=>{
        const fetchData = async ()=>{
            try {
                setLoading(true);
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch');
                const json = await response.json();
                setData(json);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setData(null);
            } finally{
                setLoading(false);
            }
        };
        fetchData();
    }, dependencies);
    return {
        data,
        loading,
        error
    };
};
export const useDebounce = (value, delay)=>{
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(()=>{
        const handler = setTimeout(()=>{
            setDebouncedValue(value);
        }, delay);
        return ()=>clearTimeout(handler);
    }, [
        value,
        delay
    ]);
    return debouncedValue;
};
export const useAsync = (asyncFunction, immediate = true)=>{
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const execute = async ()=>{
        setStatus('pending');
        setData(null);
        setError(null);
        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
            return response;
        } catch (error) {
            setError(error);
            setStatus('error');
        }
    };
    useEffect(()=>{
        if (immediate) {
            execute();
        }
    }, [
        immediate
    ]);
    return {
        execute,
        status,
        data,
        error
    };
};
