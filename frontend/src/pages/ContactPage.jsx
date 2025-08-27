import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- SVG Icons ---
const LocationIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>);
const PhoneIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>);
const EmailIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
const FacebookIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" /></svg>);
const YouTubeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>);

// --- Icon Map for Socials ---
const socialIcons = {
  facebook: <FacebookIcon />,
  youtube: <YouTubeIcon />,
};

const API_URL = 'http://localhost:5000/contact';
const API_URL_FOR_CONTACT_FORM = 'http://localhost:5000/contactUser';
const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get(API_URL);
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmissionStatus('submitting');
    try {
      // send request to backend
      await axios.post(API_URL_FOR_CONTACT_FORM, formData);

      setSubmissionStatus('success');
      // setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus('error');
    }
  };


  return (
    <div className="bg-base-100 py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary animate-fade-in">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-base-content/80 animate-fade-in delay-100">
            We’d love to hear from you. Please fill out the form below.
          </p>
        </div>

        {/* Flex Container */}
        <div className="flex flex-col lg:flex-row gap-12 items-stretch min-h-[600px]">
          {/* === Left: Form === */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-lg p-8 flex flex-col justify-between">
            <form onSubmit={handleSubmit} noValidate className="space-y-5 flex flex-col flex-grow">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Your Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Your Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Message */}
              <div className="form-control flex-grow pb-4">
                <label className="label">
                  <span className="label-text font-medium">Message</span>
                </label>
                <textarea
                  name="message"
                  className={`textarea textarea-bordered h-full w-full resize-none ${errors.message ? 'textarea-error' : ''}`}
                  placeholder="Write your message..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              {errors.message && <p className="text-error p-5 text-sm mt-1">{errors.message}</p>}

              {/* Button & Status */}
              <div>
                <button
                  type="submit"
                  className="btn btn-primary w-full "
                  disabled={submissionStatus === 'submitting'}
                >
                  {submissionStatus === 'submitting' ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    'Send Message'
                  )}
                </button>

                {submissionStatus === 'success' && (
                  <p className="text-success mt-2 text-sm">Message sent successfully!</p>
                )}
                {submissionStatus === 'error' && (
                  <p className="text-error mt-2 text-sm">Something went wrong. Please try again.</p>
                )}
              </div>
            </form>
          </div>


          {/* === Right: Contact Info & Map === */}
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-lg p-8 flex flex-col justify-between">
            {loadingInfo ? (
              <p>Loading contact info...</p>
            ) : contactInfo ? (
              <>
                {/* Info */}
                <div className="space-y-6 mb-6">
                  {contactInfo.address && (
                    <div className="flex items-start">
                      <LocationIcon />
                      <div>
                        <h3 className="text-lg font-semibold">Our Address</h3>
                        <p className="text-base-content/80">{contactInfo.address}</p>
                      </div>
                    </div>
                  )}
                  {(contactInfo.phone1 || contactInfo.phone2) && (
                    <div className="flex items-start">
                      <PhoneIcon />
                      <div>
                        <h3 className="text-lg font-semibold">Phone</h3>
                        {contactInfo.phone1 && <p className="text-base-content/80">{contactInfo.phone1}</p>}
                        {contactInfo.phone2 && <p className="text-base-content/80">{contactInfo.phone2}</p>}
                      </div>
                    </div>
                  )}
                  {contactInfo.email && (
                    <div className="flex items-start">
                      <EmailIcon />
                      <div>
                        <h3 className="text-lg font-semibold">Email</h3>
                        <p className="text-base-content/80">{contactInfo.email}</p>
                      </div>
                    </div>
                  )}
                  {contactInfo.socials && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                      <div className="flex space-x-4">
                        {Object.entries(contactInfo.socials).map(([key, value]) => (
                          <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:scale-110 transition-transform duration-200">
                            {socialIcons[key]}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Map */}
                {contactInfo.location && (
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <iframe
                      src={`https://maps.google.com/maps?q=${contactInfo.location.latitude},${contactInfo.location.longitude}&hl=es&z=14&output=embed`}
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Google Maps Location"
                    ></iframe>
                  </div>
                )}
              </>
            ) : (
              <p>Contact information could not be loaded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
