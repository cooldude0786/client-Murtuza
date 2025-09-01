import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios'; // 1. Use the centralized apiClient
import { motion } from 'framer-motion';

// --- SVG Icons ---
const LocationIcon = () => ( <svg>...</svg> );
const PhoneIcon = () => ( <svg>...</svg> );
const EmailIcon = () => ( <svg>...</svg> );
const FacebookIcon = () => ( <svg>...</svg> );
const YouTubeIcon = () => ( <svg>...</svg> );
const socialIcons = { facebook: <FacebookIcon />, youtube: <YouTubeIcon /> };

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await apiClient.get('/api/contact');
        setContactInfo(response.data);
      } catch (error) {
        console.error("Failed to fetch contact info:", error);
      } finally {
        setLoadingInfo(false);
      }
    };
    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => { /* ... (validation logic is the same) ... */ };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... (validation logic is the same)
    
    setSubmissionStatus('submitting');
    try {
      // 2. Use apiClient for the POST request
      await apiClient.post('/api/contactUser', formData);
      setSubmissionStatus('success');
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus('error');
    }
  };

  // Animation variants for a staggered effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-base-200 py-16 px-4">
      <motion.div 
        className="container mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary">Get in Touch</h1>
          <p className="mt-4 text-lg text-base-content/80">We’d love to hear from you. Please fill out the form below.</p>
        </motion.div>

        {/* Flex Container */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* === Left: Form === */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/2 card bg-base-100 shadow-xl">
            <form onSubmit={handleSubmit} noValidate className="card-body">
              <h2 className="card-title">Send us a message!</h2>
              {/* Name */}
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Your Name</span></label>
                <input type="text" name="name" className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`} placeholder="John Doe" value={formData.name} onChange={handleChange} />
                {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
              </div>
              {/* Email */}
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Your Email</span></label>
                <input type="email" name="email" className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`} placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
              </div>
              {/* Message */}
              <div className="form-control flex-grow">
                <label className="label"><span className="label-text font-medium">Message</span></label>
                <textarea name="message" className={`textarea textarea-bordered h-32 w-full resize-none ${errors.message ? 'textarea-error' : ''}`} placeholder="Write your message..." value={formData.message} onChange={handleChange}></textarea>
                {errors.message && <p className="text-error text-sm mt-1">{errors.message}</p>}
              </div>
              {/* Button & Status */}
              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-primary w-full" disabled={submissionStatus === 'submitting'}>
                  {submissionStatus === 'submitting' ? <span className="loading loading-spinner"></span> : 'Send Message'}
                </button>
              </div>
              {submissionStatus === 'success' && <p className="text-success mt-2 text-sm">Message sent successfully!</p>}
              {submissionStatus === 'error' && <p className="text-error mt-2 text-sm">Something went wrong. Please try again.</p>}
            </form>
          </motion.div>

          {/* === Right: Contact Info & Map === */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/2 card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Contact Information</h2>
              {loadingInfo ? (
                <div className="flex justify-center items-center h-full"><span className="loading loading-lg"></span></div>
              ) : contactInfo ? (
                <>
                  <div className="space-y-6">
                    {/* ... (Dynamic info rendering is the same) ... */}
                  </div>
                  {contactInfo.location && (
                    <div className="rounded-lg overflow-hidden shadow-md mt-6 h-full min-h-[250px]">
                      <iframe src={`https://maps.google.com/maps?q=${contactInfo.location.latitude},${contactInfo.location.longitude}&hl=es&z=14&output=embed`} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Google Maps Location"></iframe>
                    </div>
                  )}
                </>
              ) : (
                <p>Contact information could not be loaded.</p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactPage;