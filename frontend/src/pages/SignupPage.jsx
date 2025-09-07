import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../api/axios';
const SignupPage = () => {
    const [name, setName] = useState('khizar');
    const [email, setEmail] = useState('khizarshaikh2922@gmail.com');
    const [password, setPassword] = useState('Khizar@2922');
    const { signup } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic client-side validation
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError('All fields are required.');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }

        try {
            // Optional: simulate delay (for testing)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // API call
            const response = await apiClient.post('/api/auth/signup', {
                name: name.trim(),
                email: email.trim(),
                password
            });

            // Optional: confirm success before navigation
            if (response?.status === 201 || response?.data?.success) {
                navigate('/verify-otp', { state: { email } });
            } else {
                setError('Signup failed. Please try again.');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError(
                err.response?.data?.msg ||
                err.message ||
                'An unexpected error occurred.'
            );
        } finally {
            setLoading(false);
        }
    };



    return (
        <motion.div
            className="flex justify-center items-center min-h-screen p-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <motion.form
                onSubmit={handleSubmit}
                className="card w-96 bg-white shadow-xl rounded-lg"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                whileHover={{ scale: 1.01 }}
            >
                <div className="card-body">
                    <motion.h2
                        className="card-title text-center mb-4 text-2xl font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Sign Up
                    </motion.h2>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input input-bordered w-full mt-4"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input input-bordered w-full mt-4"
                        required
                    />

                    <div className="mt-4">
                        <motion.p
                            className="text-sm text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Login
                            </Link>
                        </motion.p>
                    </div>

                    {error && (
                        <motion.div
                            className="text-sm text-red-500 mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="card-actions justify-end mt-6">
                        <motion.button
                            type="submit"
                            className="btn btn-primary w-full flex justify-center items-center gap-2"
                            whileHover={!loading ? { scale: 1.02 } : {}}
                            whileTap={!loading ? { scale: 0.98 } : {}}
                            disabled={loading}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Signing Up...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </motion.button>

                    </div>

                </div>
            </motion.form>
        </motion.div>
    );
};

export default SignupPage;

