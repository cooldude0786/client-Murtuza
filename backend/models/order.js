const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },
  ],
  shippingInfo: { // You can expand this later with a full address form
    address: { type: String, required: true, default: 'To be confirmed' },
  },
  paymentStatus: {
    type: String,
    required: true,
    default: 'Pending Payment',
  },
  billingDetails: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
  }

}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;