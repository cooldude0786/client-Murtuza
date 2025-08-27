import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { loginWithToken } = useAuth(); // We'll add this to AuthContext
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Get email passed from signup page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiClient.post('/auth/verify-otp', { email, otp });
      loginWithToken(response.data.token); // Use context to set token and log in
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'OTP verification failed.');
    }
  };

  if (!email) {
    return <div className="p-8 text-center">Please sign up first.</div>;
  }

  return (
    <div className="flex justify-center items-center p-8">
      <form onSubmit={handleSubmit} className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Verify Your Email</h2>
          <p className="text-sm">An OTP has been sent to {email}. Please enter it below.</p>
          {error && <div className="alert alert-error text-sm">{error}</div>}
          <input 
            type="text" 
            placeholder="6-Digit Code" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            className="input input-bordered w-full" 
            required 
            maxLength="6"
          />
          <div className="card-actions">
            <button type="submit" className="btn btn-primary w-full">Verify & Login</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtpPage;