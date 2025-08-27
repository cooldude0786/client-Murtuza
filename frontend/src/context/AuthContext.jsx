import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            // You can add a call here to fetch user details using the token
            // For now, we'll just assume the presence of a token means the user is logged in
            apiClient.defaults.headers.common['x-auth-token'] = token;
            setUser({ loggedIn: true }); // Placeholder user object
        } else {
            delete apiClient.defaults.headers.common['x-auth-token'];
            setUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await apiClient.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
            return res
            
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
    const loginWithToken = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };


    const signup = async (name, email, password) => {
        const res = await apiClient.post('/auth/signup', { name, email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const value = { user, token, login, signup, logout,loginWithToken  };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};