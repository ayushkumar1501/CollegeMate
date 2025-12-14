const express = require('express');
const router = express.Router();
const {
  getAvailability,
  createBooking,
  getUserBookings,
  getBooking,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.get('/availability', getAvailability);
router.post('/create', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
