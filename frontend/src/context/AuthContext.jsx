import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // 1. Add loading state for initial auth check

    // 2. Create a reusable function to fetch user data with a token
    const fetchUser = useCallback(async () => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
            apiClient.defaults.headers.common['x-auth-token'] = currentToken;
            try {
                const res = await apiClient.get('/api/auth/me');
                setUser(res.data); // Set the actual user object
            } catch (err) {
                // If token is invalid, log the user out
                console.error("Auth token is invalid, logging out.", err);
                logout();
            }
        }
        setLoading(false);
    }, []);

    // 3. Run the user fetch logic only once on app load
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email, password) => {
        try {
            const res = await apiClient.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            await fetchUser(); // Fetch and set user data immediately after login
            return { success: true, data: res.data };
        } catch (error) {
            console.error('Login failed:', error.response?.data?.msg);
            return { success: false, msg: error.response?.data?.msg || 'Login failed' };
        }
    };

    const loginWithToken = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        fetchUser(); // Fetch and set user data after OTP verification
    };
    
    // NOTE: This signup function is for the OTP flow. It does NOT log the user in.
    const signup = async (name, email, password) => {
        await apiClient.post('/api/auth/signup', { name, email, password });
    };

    const resend = async (email) => {
        try {
            const response = await apiClient.post('/api/auth/resend-otp', { email });
            return { success: true, message: response.data.msg || 'OTP resent successfully.' };
        } catch (error) {
            const message = error.response?.data?.msg || 'Something went wrong.';
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Also remove user data
        setToken(null);
        setUser(null); // Clear the user state
        delete apiClient.defaults.headers.common['x-auth-token'];
    };

    const value = { user, token, loading, resend, login, signup, logout, loginWithToken };

    return (
        <AuthContext.Provider value={value}>
            {/* Don't render the app until the initial auth check is complete */}
            {!loading && children}
        </AuthContext.Provider>
    );
};