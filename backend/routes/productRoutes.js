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
    getAllBrands,
    getProductsByBrand,
} = require('../controllers/productController');

// Define your routes
router.get('/byid/:id', getProductById); 
// Get a product by its unique id


router.get('/all/:subSlug', getProductsByCategory); 
// Get all products within a sub-category


router.get('/lived', (req, res) => res.send('lived')); 
// Test route


router.get('/bestseller', getBestSellers); 
// Get all best-selling products


router.post('/bestseller', addBestSeller); 
// Add a product to the best sellers list


router.delete('/bestseller/:id', deleteBestSeller); 
// Delete a product from the best sellers list


router.get('/search', searchProductsByName); 
// Search products by name (case-insensitive, partial match)


router.get('/brands', getAllBrands); 
// Get a list of all unique brands (vendors)


router.get('/brand/:brandName', getProductsByBrand); 
// Get all products for a specific brand



// Make sure this line is at the end of every route file.
module.exports = router;
