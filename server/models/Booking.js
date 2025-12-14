const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide booking date']
  },
  timeSlot: {
    type: String,
    required: [true, 'Please provide time slot'],
    match: [/^\d{2}:\d{2}-\d{2}:\d{2}$/, 'Time slot format should be HH:MM-HH:MM']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: ''
  },
  orderId: {
    type: String,
    default: ''
  },
  amount: {
    type: Number,
    default: 200
  },
  mentorRemark: {
    type: String,
    default: ''
  },
  meetLink: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
bookingSchema.index({ userId: 1, date: -1 });
bookingSchema.index({ mentorId: 1, date: 1, timeSlot: 1 });
bookingSchema.index({ status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
