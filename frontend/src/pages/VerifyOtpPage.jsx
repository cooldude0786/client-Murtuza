import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginWithToken, resend } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;
  const fromLogin = location.state?.fromLogin || false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await apiClient.post('/api/auth/verify-otp', { email, otp });
      loginWithToken(response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'OTP verification failed.');
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const result = await resend(email);
      if (!result.success) {
        setError(result.message || 'Failed to resend OTP.');
      } else {
        setMessage(result.message || 'OTP resent to your email!');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error('[Resend OTP Error]', err);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return <div className="p-8 text-center">Please sign up first.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <motion.form
        onSubmit={handleSubmit}
        className="card w-full max-w-md bg-base-100 shadow-xl"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="card-body space-y-4">
          <motion.h2
            className="card-title text-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Verify Your Email
          </motion.h2>

          <motion.p
            className="text-sm text-base-content/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            An OTP has been sent to <span className="font-semibold">{email}</span>.
            Please enter it below.
          </motion.p>

          {error && (
            <motion.div
              className="alert alert-error text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div
              className="alert alert-success text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.div>
          )}

          <motion.input
            type="text"
            placeholder="6-Digit Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input input-bordered w-full transition-transform focus:scale-105"
            required
            maxLength="6"
            whileFocus={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          />

          <motion.div
            className="card-actions flex flex-col gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              type="submit"
              className="btn btn-primary w-full"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Verify & Login
            </motion.button>

            {fromLogin && (
              <motion.button
                type="button"
                onClick={handleResend}
                className="btn btn-outline w-full"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
              >
                {loading ? 'Resending...' : 'Resend OTP'}
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.form>
    </div>
  );
};

export default VerifyOtpPage;
