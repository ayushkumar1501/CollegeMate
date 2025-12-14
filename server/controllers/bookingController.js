const Booking = require('../models/Booking');
const BlockedSlot = require('../models/BlockedSlot');
const Mentor = require('../models/Mentor');
const { sendBookingConfirmation, sendAdminNotification } = require('../utils/sendEmail');

// Available time slots (3 PM to 12 AM)
const TIME_SLOTS = [
  '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00',
  '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00', '23:00-00:00'
];

// @desc    Get available slots for a date
// @route   GET /api/bookings/availability
exports.getAvailability = async (req, res) => {
  try {
    const { date, mentorId } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date'
      });
    }

    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (queryDate < today) {
      return res.json({
        success: true,
        availableSlots: [],
        message: 'Cannot book past dates'
      });
    }

    // Get blocked slots for the date
    const blockedSlot = await BlockedSlot.findOne({
      date: queryDate
    });

    let blockedTimeSlots = [];
    if (blockedSlot) {
      if (blockedSlot.isFullDay) {
        return res.json({
          success: true,
          availableSlots: [],
          message: 'This date is not available for booking'
        });
      }
      blockedTimeSlots = blockedSlot.timeSlots;
    }

    // Get booked slots for the date
    const bookingQuery = {
      date: queryDate,
      status: { $in: ['pending', 'confirmed'] }
    };
    
    if (mentorId) {
      bookingQuery.mentorId = mentorId;
    }

    const bookedSlots = await Booking.find(bookingQuery).select('timeSlot');
    const bookedTimeSlots = bookedSlots.map(b => b.timeSlot);

    // Filter available slots
    const availableSlots = TIME_SLOTS.filter(slot => 
      !blockedTimeSlots.includes(slot) && !bookedTimeSlots.includes(slot)
    );

    // If today, filter out past time slots
    if (queryDate.getTime() === today.getTime()) {
      const currentHour = new Date().getHours();
      const filteredSlots = availableSlots.filter(slot => {
        const slotHour = parseInt(slot.split(':')[0]);
        return slotHour > currentHour;
      });
      return res.json({
        success: true,
        availableSlots: filteredSlots,
        allSlots: TIME_SLOTS
      });
    }

    res.json({
      success: true,
      availableSlots,
      allSlots: TIME_SLOTS
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create booking
// @route   POST /api/bookings/create
exports.createBooking = async (req, res) => {
  try {
    const { mentorId, date, timeSlot, orderId, paymentId } = req.body;

    // Validate mentor
    const mentor = await Mentor.findById(mentorId);
    if (!mentor || !mentor.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mentor selected'
      });
    }

    // Check slot availability
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const existingBooking = await Booking.findOne({
      mentorId,
      date: queryDate,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'This slot is already booked'
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      mentorId,
      date: queryDate,
      timeSlot,
      orderId,
      paymentId,
      status: 'confirmed',
      amount: 200
    });

    // Populate for email
    const populatedBooking = await Booking.findById(booking._id)
      .populate('mentorId')
      .populate('userId');

    // Send emails
    await sendBookingConfirmation(req.user, populatedBooking, mentor);
    await sendAdminNotification(req.user, populatedBooking, mentor);

    res.status(201).json({
      success: true,
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('mentorId', 'name photo')
      .sort({ date: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('mentorId')
      .populate('userId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
