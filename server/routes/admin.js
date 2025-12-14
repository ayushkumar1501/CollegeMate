const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  addRemark,
  blockSlots,
  unblockSlots,
  getBlockedSlots,
  getAnalytics,
  getAllUsers,
  getUserBookings
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require admin authentication
router.use(protect, adminOnly);

router.get('/bookings', getAllBookings);
router.put('/bookings/:id/remark', addRemark);
router.post('/blocked-slots', blockSlots);
router.delete('/blocked-slots/:id', unblockSlots);
router.get('/blocked-slots', getBlockedSlots);
router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.get('/users/:id/bookings', getUserBookings);

module.exports = router;
