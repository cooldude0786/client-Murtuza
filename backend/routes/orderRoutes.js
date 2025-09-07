const express = require('express');
const router = express.Router();
const { createOrder,getMyOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/lived', (req, res) => res.send('lived'));
// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', authMiddleware, createOrder);



router.get('/myorders', authMiddleware, getMyOrders);


module.exports = router;