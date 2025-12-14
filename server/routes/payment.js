const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/:orderId', protect, getPayment);

module.exports = router;
