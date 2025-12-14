const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    type: String,
    required: true
  },
  college: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'Student'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    minlength: [20, 'Review must be at least 20 characters'],
    maxlength: [500, 'Review cannot exceed 500 characters']
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isSeeded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

reviewSchema.index({ isApproved: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
