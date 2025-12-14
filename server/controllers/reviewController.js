const Review = require('../models/Review');

// @desc    Get all approved reviews
// @route   GET /api/reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit a review (logged in users only)
// @route   POST /api/reviews
exports.submitReview = async (req, res) => {
  try {
    const { rating, review, college, role } = req.body;

    // Check if user already submitted a review
    const existingReview = await Review.findOne({ userId: req.user.id });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review'
      });
    }

    const newReview = await Review.create({
      userId: req.user.id,
      name: req.user.name,
      college: college || '',
      role: role || 'Student',
      rating,
      review,
      isApproved: false // Requires admin approval
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! It will be visible after admin approval.',
      review: newReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/reviews/admin
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve/Reject review (admin)
// @route   PUT /api/reviews/:id/approve
exports.approveReview = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: isApproved ? 'Review approved' : 'Review rejected',
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review (admin)
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
