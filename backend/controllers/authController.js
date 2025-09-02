const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const otpGenerator = require('otp-generator');
const sendEmail = require('../src/utils/mailer');
// Signup a new user


exports.signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic input validation
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters.' });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // 2. Check for existing user
    const existingUser = await User.findOne({ email: sanitizedEmail });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ msg: 'User with this email already exists.' });
      } else {
        // Optionally: allow to resend OTP to unverified users
        return res.status(400).json({ msg: 'This email is already registered but not verified. Please check your email or request a new OTP.' });
      }
    }

    // 3. Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // 4. Send OTP email BEFORE saving user
    try {
      const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #333;">Welcome to <span style="color: #007bff;">MyStore</span>!</h2>
      <p style="font-size: 16px; color: #555;">Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
      <div style="font-size: 24px; font-weight: bold; color: #007bff; margin: 20px 0;">${otp}</div>
      <p style="font-size: 14px; color: #999;">This code will expire in <strong>10 minutes</strong>.</p>
      <hr style="margin: 30px 0;">
      <p style="font-size: 12px; color: #aaa;">If you didn’t request this, you can safely ignore this email.</p>
    </div>  
  `;

      const plainMessage = `
Welcome to MyStore!

Thank you for signing up. Your One-Time Password (OTP) is: ${otp}

It will expire in 10 minutes.

If you didn’t request this, you can safely ignore this email.
`;

      await sendEmail({
        email: sanitizedEmail,
        subject: 'Your MyStore Verification Code',
        message: plainMessage,       // Fallback for plain text clients
        html: htmlMessage            // HTML version for richer formatting
      });

    } catch (emailError) {
      console.error('Email send failed:', emailError);
      return res.status(500).json({ msg: 'Failed to send verification email. Please try again later.' });
    }


    // 5. Create new user and save (triggers password hash)
    const user = new User({
      name: name.trim(),
      email: sanitizedEmail,
      password, // will be hashed in schema
      otp,
      otpExpires,
    });

    await user.save();

    // 6. Respond success
    return res.status(201).json({
      msg: 'User registered successfully. Please check your email for an OTP.',
    });

  } catch (err) {
    console.error('Signup error:', err);

    // Handle duplicate key error (e.g., race condition)
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ msg: 'Email is already in use.' });
    }

    return res.status(500).json({ msg: 'Server error. Please try again.' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Validate inputs
    if (!email || !otp) {
      return res.status(400).json({ msg: 'Email and OTP are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find the user with matching OTP that hasn't expired
    const user = await User.findOne({
      email: normalizedEmail,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired OTP.' });
    }

    // 3. Mark user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    // 4. Generate JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    return res.status(200).json({
      msg: 'Account verified successfully.',
      token,
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ msg: 'Server error. Please try again.' });
  }
};


// Login an existing user
exports.loginUser = async (req, res) => {
  try {

    // 1. Validate input using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    if (!email || !password) {

      return res.status(400).json({ msg: 'Email and password are required. ' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Find user
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {

      return res.status(400).json({ msg: 'Invalid email or password. from here' });
    }

    // 3. Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ msg: 'Email not verified. Please verify your account before logging in.' });
    }

    // 4. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {

      return res.status(400).json({ msg: 'Invalid email or password. ' });
    }

    // 5. Generate JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    return res.status(200).json({
      msg: 'Login successful.',
      token,
    });
  } catch (err) {

    console.error('Login error:', err);
    return res.status(500).json({ msg: 'Server error. Please try again.' });
  }
};

/**
 * @desc Resend OTP to user's email if not verified
 * @route POST /auth/resend-otp
 * @access Public
 */
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Validate input
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ msg: 'Email is required.' });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // 🔍 Find user
    const user = await User.findOne({ email: sanitizedEmail });

    if (!user) {
      return res.status(404).json({ msg: 'No account found with this email.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: 'This account is already verified.' });
    }

    // 🔢 Generate secure 6-digit numeric OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const OTP_EXPIRY_MINUTES = 10;
    const otpExpires = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

    // 📧 Send email
    try {
      await sendEmail({
        email: sanitizedEmail,
        subject: 'Your MyStore Verification Code (Resent)',
        message: `Here is your new One-Time Password (OTP): ${otp}\n\nThis code will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\nIf you did not request this, please ignore this email.`,
      });
    } catch (emailError) {
      console.error(`[Resend OTP] Failed to send email: ${emailError.message}`);
      return res.status(500).json({ msg: 'Failed to send OTP. Please try again shortly.' });
    }

    // 📝 Update user OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    console.log(`[Resend OTP] OTP resent to ${sanitizedEmail}`);

    return res.status(200).json({ msg: 'A new OTP has been sent to your email.' });

  } catch (err) {
    console.error(`[Resend OTP] Server error: ${err.message}`);
    return res.status(500).json({ msg: 'Something went wrong. Please try again later.' });
  }
};
