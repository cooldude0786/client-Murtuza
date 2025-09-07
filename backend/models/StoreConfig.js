const mongoose = require('mongoose');

const storeConfigSchema = new mongoose.Schema({
  taxRate: { // e.g., 0.18 for 18% GST
    type: Number,
    required: true,
    default: 0,
  },
  shippingCharge: { // The flat shipping fee
    type: Number,
    required: true,
    default: 0,
  },
  freeShippingThreshold: { // The order subtotal above which shipping is free
    type: Number,
    required: true,
    default: 1000,
  },
});

const StoreConfig = mongoose.model('StoreConfig', storeConfigSchema);
module.exports = StoreConfig;