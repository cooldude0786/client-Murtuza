// controllers/categoryController.js
const Category = require('../models/category');

/**
 * @desc    Create or update a category. Uses upsert to avoid duplicates.
 * @route   POST /api/categories
 * @access  Private
 */
exports.addCategory = async (req, res) => {
  try {
    const { _id, name, slug, subCategories } = req.body;

    // Basic validation
    if (!_id || !name || !slug) {
      return res.status(400).json({ msg: 'Please provide _id, name, and slug' });
    }

    const categoryData = {
      _id,
      name,
      slug,
      subCategories
    };

    // Use updateOne with upsert to create or update the category
    await Category.updateOne(
      { _id: categoryData._id },
      { $set: categoryData },
      { upsert: true }
    );

    res.status(201).json({ msg: 'Category created/updated successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Fetch all categories
 * @route   GET /api/categories
 * @access  Public
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};