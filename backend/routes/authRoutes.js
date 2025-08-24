// // config/index.js
// const dotenv = require('dotenv');

// dotenv.config();

// module.exports = {
//     port: process.env.PORT || 5000,
//     mongoURI: process.env.MONGO_URI,
//     jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_change_me',
//     jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h'
// };

const express = require('express');
const router = express.Router();

router.get('/lived', (req, res) => res.send('lived'));  

// --- THIS IS THE FIX ---
// Make sure this line is at the end of every route file.
module.exports = router;
