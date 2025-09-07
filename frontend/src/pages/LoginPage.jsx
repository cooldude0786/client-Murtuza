import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate,useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/axios';

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const LoginPage = () => {
  const [email, setEmail] = useState('khizarshaikh2922@gmail.com');
  const [password, setPassword] = useState('Khizar@2922');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, resend } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // 2. Get the location object
  const from = location.state?.from?.pathname || "/";

  const validateInputs = () => {
    if (!isValidEmail(email)) {
      setError('Please enter a valid email.');
      return false;
    }
    if (!isForgotPassword && password.trim().length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateInputs()) return;

    try {
      setLoading(true);
      const result = await login(email, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        if (result.status.status === 403) {
          // Redirect to verify OTP page
          navigate('/verify-otp', { state: { email, fromLogin: true } });
          // you can pass email via state so user doesn’t re-enter
        } else {
          setError(result || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);

      const res = await apiClient.post("/api/auth/resend-otp", { email });

      if (res.status === 200) {
        setMessage(res.data.msg || "OTP has been sent to your email.");
      }
    } catch (err) {
      console.error("Reset password error:", err);

      if (err.response) {
        setError(err.response.data.msg || "Failed to send OTP.");
      } else {
        setError("Network error. Please try again.");
      }
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
        onSubmit={isForgotPassword ? handleForgotPassword : handleSubmit}
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
            {isForgotPassword ? 'Reset Password' : 'Login'}
          </motion.h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
              setMessage('');
            }}
            className={`input input-bordered w-full ${error && !isValidEmail(email) ? 'input-error' : ''
              }`}
            required
          />

          <AnimatePresence>
            {!isForgotPassword && (
              <motion.input
                key="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={`input input-bordered w-full mt-4 ${error && password.length < 6 ? 'input-error' : ''
                  }`}
                required
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                className="alert alert-error text-sm mt-3"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {message && (
            <motion.div
              className="text-sm text-green-500 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message}
            </motion.div>
          )}

          <div className="mt-4 space-y-2">
            {!isForgotPassword ? (
              <>
                <motion.p
                  onClick={() => setIsForgotPassword(true)}
                  className="text-sm text-blue-500 hover:underline cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  Forgot Password?
                </motion.p>

                <motion.p
                  className="text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Don&apos;t have an account?{' '}
                  <Link to="/signup" className="text-blue-600 hover:underline">
                    Sign Up
                  </Link>
                </motion.p>
              </>
            ) : (
              <motion.p
                onClick={() => {
                  setIsForgotPassword(false);
                  setMessage('');
                }}
                className="text-sm text-blue-500 hover:underline cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                Back to Login
              </motion.p>
            )}
          </div>

          <div className="card-actions justify-end mt-6">
            <motion.button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm text-white" />
              ) : isForgotPassword ? (
                'Reset'
              ) : (
                'Sign In'
              )}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default LoginPage;
