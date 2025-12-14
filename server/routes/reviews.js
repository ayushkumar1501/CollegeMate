const express = require('express');
const router = express.Router();
const {
  getReviews,
  submitReview,
  getAllReviews,
  approveReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route
router.get('/', getReviews);

// Protected routes (logged in users)
router.post('/', protect, submitReview);

// Admin routes
router.get('/admin', protect, adminOnly, getAllReviews);
router.put('/:id/approve', protect, adminOnly, approveReview);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
