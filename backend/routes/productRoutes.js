// routes/productRoutes.js
const express = require('express');
const router = express.Router();


// Import your controller functions
const {
    getProductsByCategory,
    getProductById,
    getBestSellers,
    addBestSeller,
    deleteBestSeller,
    searchProductsByName,
} = require('../controllers/productController');

// Define your routes
// --- THIS IS THE FIX ---
router.get('/byid/:id', getProductById);


router.get('/all/:subSlug', getProductsByCategory);


router.get('/lived', (req, res) => res.send('lived'));

router.get('/bestseller', getBestSellers);

router.post('/bestseller', addBestSeller);

router.delete('/bestseller/:id', deleteBestSeller);

router.get('/search', searchProductsByName);


// Make sure this line is at the end of every route file.
module.exports = router;