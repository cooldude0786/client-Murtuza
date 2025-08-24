const express = require('express');
const router = express.Router();

router.get('/lived', (req, res) => res.send('lived'));

// --- THIS IS THE FIX ---
// Make sure this line is at the end of every route file.
module.exports = router;
