const mongoose = require('mongoose');

const bestSellerSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true,
  }
});

const BestSeller = mongoose.model('BestSeller', bestSellerSchema);

module.exports = BestSeller;