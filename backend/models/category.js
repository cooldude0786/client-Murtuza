// models/category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Manually setting ID, e.g., "CAT_DIMENSIONS"
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  subCategories: [{
    name: { type: String, required: true },
    slug: { type: String, required: true }
  }]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;