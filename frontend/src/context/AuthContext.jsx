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
                const res = await apiClient.post('/api/auth/login', { email, password });
                localStorage.setItem('token', res.data.token);
                setToken(res.data.token);
                return { success: true, data: res.data };


            } catch (error) {
                console.error('Login failed:', error.response.data.msg);
                return { success: false, status: error.response, msg: error.response.data.msg };

            }
        };
        const loginWithToken = (newToken) => {
            localStorage.setItem('token', newToken);
            setToken(newToken);
        };


        const signup = async (name, email, password) => {
            const res = await apiClient.post('/api/auth/signup', { name, email, password });
            localStorage.setItem('token', res.data.token);
            setToken(res.data.token);
        };
        const resend = async (email) => {
            try {
                const response = await apiClient.post('/api/auth/resend-otp', { email });

                // ✅ Success response (status 200)
                return {
                    success: true,
                    message: response.data.msg || 'OTP resent successfully.',
                };
            } catch (error) {
                // 🔍 Check if server responded with an error
                if (error.response) {
                    const status = error.response.status;
                    const message = error.response.data?.msg || 'Something went wrong.';

                    return {
                        success: false,
                        status,
                        message,
                    };
                }

                // ❌ Network or unknown error
                return {
                    success: false,
                    status: 0,
                    message: 'Network error or server not reachable.',
                };
            }
        };

        

        const logout = () => {
            localStorage.removeItem('token');
            setToken(null);
        };

        const value = { user, token, resend, login, signup, logout, loginWithToken };

        return (
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        );
    };