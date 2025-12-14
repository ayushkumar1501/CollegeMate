const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide mentor name'],
    trim: true
  },
  bio: {
    type: String,
    required: [true, 'Please provide mentor bio'],
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  photo: {
    type: String,
    default: 'https://via.placeholder.com/300x300?text=Mentor'
  },
  linkedIn: {
    type: String,
    default: ''
  },
  instagram: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mentor', mentorSchema);
