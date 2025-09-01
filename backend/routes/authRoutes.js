const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

// @route   POST /api/auth/signup
router.post('/signup', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
], authController.signupUser);

// @route   POST /api/auth/verify-otp
router.post('/verify-otp', [
    check('email', 'Email is required').isEmail(),
    check('otp', 'OTP is required').isLength({ min: 6, max: 6 }),
], authController.verifyOtp);

// @route   POST /api/auth/login
router.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
], authController.loginUser);


// @route   POST /api/auth/login
router.post('/resend-otp', [
    check('email', 'Please include a valid email').isEmail(),
], authController.resendOtp);


router.get('/lived', (req, res) => res.send('lived'));

// --- THIS IS THE FIX ---
// Make sure this line is at the end of every route file.
module.exports = router;
