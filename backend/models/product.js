// models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  sku: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  vendor: { type: String, index: true },
  category: {
    parentSlug: { type: String, required: true },
    subSlug: { type: String, required: true, index: true }
  },
  isAvailable: { type: Boolean, default: false, index: true },
  pricing: {
    price: { type: Number, required: true },
    compareAtPrice: { type: Number }
  },
  shipping: {
    requiresShipping: { type: Boolean, default: true },
    weight: {
      value: { type: Number },
      unit: { type: String }
    }
  },
  technicalSpecifications: { type: Map, of: String },
  images: [{
    id: { type: Number },
    path: { type: String },
    altText: { type: String },
    position: { type: Number }
  }],
  variants: [{
    id: { type: Number },
    title: { type: String },
    sku: { type: String },
    isAvailable: { type: Boolean },
    price: { type: Number }
  }]
}, {
  // Mongoose automatically adds createdAt and updatedAt fields
  timestamps: true
});

// Create a text index for keyword searches on title and description
productSchema.index({ title: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;