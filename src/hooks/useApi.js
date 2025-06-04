import { useState, useCallback } from 'react';
import api from '../api/axios';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, url, data = null) => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await api({
                method,
                url,
                data
            });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Une erreur est survenue';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        get: useCallback((url) => request('get', url), [request]),
        post: useCallback((url, data) => request('post', url, data), [request]),
        put: useCallback((url, data) => request('put', url, data), [request]),
        remove: useCallback((url) => request('delete', url), [request]),
    };
};

export default useApi;
