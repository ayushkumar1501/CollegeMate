const Booking = require('../models/Booking');
const User = require('../models/User');
const Mentor = require('../models/Mentor');
const BlockedSlot = require('../models/BlockedSlot');
const Payment = require('../models/Payment');

// @desc    Get all bookings
// @route   GET /api/admin/bookings
exports.getAllBookings = async (req, res) => {
  try {
    const { status, mentorId, startDate, endDate } = req.query;
    const query = {};

    if (status) query.status = status;
    if (mentorId) query.mentorId = mentorId;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('mentorId', 'name')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add mentor remark
// @route   PUT /api/admin/bookings/:id/remark
exports.addRemark = async (req, res) => {
  try {
    const { remark, status } = req.body;
    const updateData = { mentorRemark: remark };
    if (status) updateData.status = status;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('userId', 'name email').populate('mentorId', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
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

// @desc    Block slots
// @route   POST /api/admin/blocked-slots
exports.blockSlots = async (req, res) => {
  try {
    const { date, timeSlots, isFullDay, reason } = req.body;
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    let blockedSlot = await BlockedSlot.findOne({ date: queryDate });

    if (blockedSlot) {
      blockedSlot.timeSlots = [...new Set([...blockedSlot.timeSlots, ...timeSlots])];
      blockedSlot.isFullDay = isFullDay || blockedSlot.isFullDay;
      blockedSlot.reason = reason || blockedSlot.reason;
      await blockedSlot.save();
    } else {
      blockedSlot = await BlockedSlot.create({
        date: queryDate,
        timeSlots,
        isFullDay,
        reason,
        createdBy: req.user.id
      });
    }

    res.json({
      success: true,
      blockedSlot
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Unblock slots
// @route   DELETE /api/admin/blocked-slots/:id
exports.unblockSlots = async (req, res) => {
  try {
    const { timeSlots } = req.body;
    const blockedSlot = await BlockedSlot.findById(req.params.id);

    if (!blockedSlot) {
      return res.status(404).json({
        success: false,
        message: 'Blocked slot not found'
      });
    }

    if (timeSlots && timeSlots.length > 0) {
      blockedSlot.timeSlots = blockedSlot.timeSlots.filter(
        slot => !timeSlots.includes(slot)
      );
      blockedSlot.isFullDay = false;
      await blockedSlot.save();
    } else {
      await blockedSlot.deleteOne();
    }

    res.json({
      success: true,
      message: 'Slots unblocked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get blocked slots
// @route   GET /api/admin/blocked-slots
exports.getBlockedSlots = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const blockedSlots = await BlockedSlot.find(query).sort({ date: 1 });

    res.json({
      success: true,
      blockedSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get analytics
// @route   GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Total bookings
    const totalBookings = await Booking.countDocuments({ status: { $ne: 'cancelled' } });
    
    // Today's bookings
    const todayBookings = await Booking.countDocuments({
      date: today,
      status: { $ne: 'cancelled' }
    });

    // This week's bookings
    const weekBookings = await Booking.countDocuments({
      date: { $gte: startOfWeek },
      status: { $ne: 'cancelled' }
    });

    // This month's bookings
    const monthBookings = await Booking.countDocuments({
      date: { $gte: startOfMonth },
      status: { $ne: 'cancelled' }
    });

    // Revenue
    const totalRevenue = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthRevenue = await Booking.aggregate([
      { $match: { date: { $gte: startOfMonth }, status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Mentor-wise stats
    const mentorStats = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: '$mentorId', count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
      { $lookup: { from: 'mentors', localField: '_id', foreignField: '_id', as: 'mentor' } },
      { $unwind: '$mentor' },
      { $project: { name: '$mentor.name', count: 1, revenue: 1 } }
    ]);

    // Popular time slots
    const popularSlots = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: '$timeSlot', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Total users
    const totalUsers = await User.countDocuments({ role: 'user' });

    res.json({
      success: true,
      analytics: {
        bookings: {
          total: totalBookings,
          today: todayBookings,
          thisWeek: weekBookings,
          thisMonth: monthBookings
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          thisMonth: monthRevenue[0]?.total || 0
        },
        mentorStats,
        popularSlots,
        totalUsers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user booking history
// @route   GET /api/admin/users/:id/bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.id })
      .populate('mentorId', 'name')
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
