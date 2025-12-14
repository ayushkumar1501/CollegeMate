const mongoose = require('mongoose');

const blockedSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Please provide date']
  },
  timeSlots: [{
    type: String
  }],
  isFullDay: {
    type: Boolean,
    default: false
  },
  reason: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

blockedSlotSchema.index({ date: 1 });

module.exports = mongoose.model('BlockedSlot', blockedSlotSchema);
