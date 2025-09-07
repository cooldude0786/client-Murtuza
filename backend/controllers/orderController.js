const Order = require('../models/order');
const StoreConfig = require('../models/StoreConfig');
const User = require('../models/user');
const sendEmail = require('../src/utils/mailer');

exports.createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;
    const user = await User.findById(req.user.id);
    const config = await StoreConfig.findOne();

    if (!config) {
      return res.status(500).json({ msg: 'Store configuration is not set.' });
    }

    // Server-side calculation
    const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal >= config.freeShippingThreshold ? 0 : config.shippingCharge;
    const tax = subtotal * config.taxRate;
    const total = subtotal + shipping + tax;

    // Save order
    const order = new Order({
      orderItems,
      user: req.user.id,
      billingDetails: {
        subtotal,
        shipping,
        tax,
        total,
      },
    });

    const createdOrder = await order.save();

    // --- Enhanced HTML Email ---
    const itemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name} (x${item.quantity})</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const customerMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">
        <div style="border-bottom: 3px solid #4CAF50; padding-bottom: 10px; margin-bottom: 20px;">
          <h2 style="color: #4CAF50;">🛍️ Thank you for your order, ${user.name}!</h2>
          <p style="font-size: 16px;">Your order ID is <strong>#${createdOrder._id}</strong></p>
        </div>

        <h3 style="margin-top: 0;">🧾 Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 15px; margin-bottom: 20px;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="text-align: left; padding: 10px; border-bottom: 1px solid #ddd;">Item</th>
              <th style="text-align: right; padding: 10px; border-bottom: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="font-size: 15px; margin-bottom: 30px;">
          <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
          <p><strong>Shipping:</strong> $${shipping.toFixed(2)}</p>
          <p><strong>Tax:</strong> $${tax.toFixed(2)}</p>
          <p style="font-size: 18px;"><strong>Total:</strong> <span style="color: #4CAF50;">$${total.toFixed(2)}</span></p>
        </div>

        <div style="background-color: #f1f1f1; padding: 20px; border-radius: 6px; margin-bottom: 30px;">
          <h3 style="margin-top: 0;">💳 Payment Instructions</h3>
          <p>Please transfer the total amount to the account below:</p>
          <ul style="line-height: 1.6;">
            <li><strong>Bank Name:</strong> Your Bank Name</li>
            <li><strong>Account Number:</strong> 1234567890</li>
            <li><strong>Account Name:</strong> Your Company Name</li>
          </ul>
          <p>After payment, kindly reply to this email with a screenshot of the transaction as proof of payment.</p>
        </div>

        <p style="font-size: 14px; color: #666;">If you have any questions, feel free to reply to this email or contact our support team.</p>

        <div style="border-top: 1px solid #eee; margin-top: 40px; padding-top: 10px; text-align: center; font-size: 12px; color: #aaa;">
          <p>Your Store Name © ${new Date().getFullYear()} | All rights reserved</p>
        </div>
      </div>
    `;

    // Send email to customer
    await sendEmail({
      email: user.email,
      subject: `Order Confirmation - #${createdOrder._id}`,
      html: customerMessage,
    });

    // Send internal sales team notification
    await sendEmail({
      email: process.env.INTERNAL_SALES_EMAIL,
      subject: `New Order Received - #${createdOrder._id}`,
      html: `
        <p>A new order has been placed by <strong>${user.name}</strong> (${user.email}).</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <p>Order ID: <strong>#${createdOrder._id}</strong></p>
        <p>Please wait for payment confirmation before processing.</p>
      `,
    });

    res.status(201).json(createdOrder);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/myorders
 * @access  Private
 */
exports.getMyOrders = async (req, res) => {
  try {
    // req.user.id comes from the authMiddleware
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
