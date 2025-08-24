// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();

// Import the controller functions
const { 
  addCategory, 
  getAllCategories 
} = require('../controllers/categoryController');

// --- API Routes ---

// @desc    Fetch all categories and their sub-categories
// @route   GET /api/categories
router.get('/', getAllCategories);

// @desc    Add or update a category
// @route   POST /api/categories
router.post('/', addCategory);

// @desc    Test route
// @route   GET /api/categories/lived
router.get('/lived', (req, res) => res.send('lived'));


module.exports = router;