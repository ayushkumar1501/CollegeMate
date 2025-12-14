import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiMessageSquare,
  FiX,
  FiLock,
  FiUnlock,
  FiEye
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import api from '../services/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', mentorId: '' });
  const [remarkModal, setRemarkModal] = useState({ open: false, bookingId: null, remark: '' });
  const [blockModal, setBlockModal] = useState({
    open: false,
    date: null,
    slots: [],
    isFullDay: false,
    reason: ''
  });
  const [viewBookingModal, setViewBookingModal] = useState({ open: false, booking: null });
  const [reviews, setReviews] = useState([]);

  const timeSlots = [
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00',
    '18:00-19:00',
    '19:00-20:00',
    '20:00-21:00',
    '21:00-22:00',
    '22:00-23:00',
    '23:00-00:00'
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab, filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data.analytics);
      } else if (activeTab === 'bookings') {
        const params = {};
        if (filters.status) params.status = filters.status;
        const res = await api.get('/admin/bookings', { params });
        setBookings(res.data.bookings);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data.users);
      } else if (activeTab === 'calendar') {
        const res = await api.get('/admin/blocked-slots');
        setBlockedSlots(res.data.blockedSlots);
      } else if (activeTab === 'reviews') {
        const res = await api.get('/reviews/admin');
        setReviews(res.data.reviews);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRemark = async () => {
    try {
      await api.put(`/admin/bookings/${remarkModal.bookingId}/remark`, {
        remark: remarkModal.remark,
        status: 'completed'
      });
      toast.success('Remark added & marked complete');
      setRemarkModal({ open: false, bookingId: null, remark: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add remark');
    }
  };

  const handleBlockSlots = async () => {
    if (!blockModal.date) {
      toast.error('Please select a date');
      return;
    }
    try {
      await api.post('/admin/blocked-slots', {
        date: blockModal.date,
        timeSlots: blockModal.isFullDay ? timeSlots : blockModal.slots,
        isFullDay: blockModal.isFullDay,
        reason: blockModal.reason
      });
      toast.success('Slots blocked successfully');
      setBlockModal({ open: false, date: null, slots: [], isFullDay: false, reason: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to block slots');
    }
  };

  const handleUnblock = async (id) => {
    if (!window.confirm('Are you sure you want to unblock this?')) return;
    try {
      await api.delete(`/admin/blocked-slots/${id}`);
      toast.success('Unblocked successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to unblock');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeSlot = (slot) => {
    if (!slot) return '';
    const [start, end] = slot.split('-');
    const formatTime = (time) => {
      const [hours] = time.split(':');
      const h = parseInt(hours);
      if (h === 0 || h === 24) return '12 AM';
      if (h === 12) return '12 PM';
      return h > 12 ? `${h - 12} PM` : `${h} AM`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success/20 text-success';
      case 'completed':
        return 'bg-primary/20 text-primary';
      case 'cancelled':
        return 'bg-error/20 text-error';
      default:
        return 'bg-warning/20 text-warning';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiTrendingUp },
    { id: 'bookings', label: 'All Bookings', icon: FiCalendar },
    { id: 'calendar', label: 'Block Slots', icon: FiLock },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'reviews', label: 'Reviews', icon: FiMessageSquare }
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light-100">Admin Dashboard</h1>
          <p className="text-light-400 mt-1">Manage bookings, users, and availability</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-dark-800 p-2 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition font-medium ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-light-400 hover:text-light-100 hover:bg-dark-700'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && analytics && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-light-400 text-sm">Total Bookings</p>
                        <p className="text-3xl font-bold text-light-100 mt-1">
                          {analytics.bookings.total}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                        <FiCalendar className="text-primary" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-light-400 text-sm">Today's Bookings</p>
                        <p className="text-3xl font-bold text-light-100 mt-1">
                          {analytics.bookings.today}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                        <FiClock className="text-accent" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-light-400 text-sm">Total Revenue</p>
                        <p className="text-3xl font-bold text-light-100 mt-1">
                          ₹{analytics.revenue.total}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                        <FiDollarSign className="text-success" size={24} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-light-400 text-sm">Total Users</p>
                        <p className="text-3xl font-bold text-light-100 mt-1">
                          {analytics.totalUsers}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                        <FiUsers className="text-secondary" size={24} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                    <h3 className="text-lg font-semibold text-light-100 mb-4">Mentor Performance</h3>
                    <div className="space-y-4">
                      {analytics.mentorStats?.map((stat) => (
                        <div key={stat._id} className="flex items-center justify-between">
                          <span className="text-light-300">{stat.name}</span>
                          <div className="text-right">
                            <span className="text-light-100 font-semibold">{stat.count} sessions</span>
                            <span className="text-success text-sm ml-2">₹{stat.revenue}</span>
                          </div>
                        </div>
                      ))}
                      {(!analytics.mentorStats || analytics.mentorStats.length === 0) && (
                        <p className="text-light-400 text-center py-4">No data yet</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                    <h3 className="text-lg font-semibold text-light-100 mb-4">Popular Time Slots</h3>
                    <div className="space-y-4">
                      {analytics.popularSlots?.map((slot, index) => (
                        <div key={slot._id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs mr-3">
                              {index + 1}
                            </span>
                            <span className="text-light-300">{formatTimeSlot(slot._id)}</span>
                          </div>
                          <span className="text-light-100 font-semibold">{slot.count} bookings</span>
                        </div>
                      ))}
                      {(!analytics.popularSlots || analytics.popularSlots.length === 0) && (
                        <p className="text-light-400 text-center py-4">No data yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="input-field w-auto"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Bookings Table */}
                <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-dark-900">
                        <tr>
                          <th className="text-left py-4 px-4 text-light-400 font-medium">User</th>
                          <th className="text-left py-4 px-4 text-light-400 font-medium">Mentor</th>
                          <th className="text-left py-4 px-4 text-light-400 font-medium">Date & Time</th>
                          <th className="text-left py-4 px-4 text-light-400 font-medium">Status</th>
                          <th className="text-left py-4 px-4 text-light-400 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking) => (
                          <tr key={booking._id} className="border-t border-dark-700 hover:bg-dark-700/50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-light-100 font-medium">{booking.userId?.name}</p>
                                <p className="text-light-400 text-sm">{booking.userId?.email}</p>
                                <p className="text-light-400 text-sm">{booking.userId?.phone}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-light-300">{booking.mentorId?.name}</td>
                            <td className="py-4 px-4">
                              <p className="text-light-100">{formatDate(booking.date)}</p>
                              <p className="text-light-400 text-sm">{formatTimeSlot(booking.timeSlot)}</p>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setViewBookingModal({ open: true, booking })}
                                  className="p-2 text-light-400 hover:text-primary transition"
                                  title="View Details"
                                >
                                  <FiEye size={18} />
                                </button>
                                {booking.status === 'confirmed' && (
                                  <button
                                    onClick={() =>
                                      setRemarkModal({ open: true, bookingId: booking._id, remark: '' })
                                    }
                                    className="p-2 text-light-400 hover:text-success transition"
                                    title="Add Remark & Complete"
                                  >
                                    <FiMessageSquare size={18} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {bookings.length === 0 && (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-light-400">
                              No bookings found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Calendar/Block Slots Tab */}
            {activeTab === 'calendar' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-light-100">Blocked Dates & Slots</h2>
                  <button
                    onClick={() => setBlockModal({ ...blockModal, open: true })}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FiLock size={18} />
                    <span>Block New Slots</span>
                  </button>
                </div>

                {/* Blocked Slots List */}
                <div className="space-y-4">
                  {blockedSlots.length === 0 ? (
                    <div className="bg-dark-800 rounded-xl p-8 text-center border border-dark-700">
                      <FiUnlock className="mx-auto text-light-400 mb-4" size={48} />
                      <p className="text-light-400">No blocked slots. All dates are available for booking.</p>
                    </div>
                  ) : (
                    blockedSlots.map((blocked) => (
                      <div
                        key={blocked._id}
                        className="bg-dark-800 rounded-xl p-6 border border-dark-700 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <FiCalendar className="text-error" />
                            <p className="text-light-100 font-semibold text-lg">
                              {formatDate(blocked.date)}
                            </p>
                            {blocked.isFullDay && (
                              <span className="bg-error/20 text-error px-2 py-1 rounded text-xs">
                                Full Day
                              </span>
                            )}
                          </div>
                          {!blocked.isFullDay && blocked.timeSlots?.length > 0 && (
                            <p className="text-light-400 text-sm">
                              Blocked slots: {blocked.timeSlots.map(formatTimeSlot).join(', ')}
                            </p>
                          )}
                          {blocked.reason && (
                            <p className="text-light-400 text-sm mt-1">Reason: {blocked.reason}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleUnblock(blocked._id)}
                          className="btn-secondary flex items-center space-x-2"
                        >
                          <FiUnlock size={16} />
                          <span>Unblock</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-dark-900">
                        <tr>
                          <th className="text-left py-4 px-4 text-light-400 font-medium">Name</th>
                          <th className="text-left py-4 px-4 text-light-400 font-medium">Email</th>
                          <th className="text-left py-4 px-4 text-light-400 font-medium">Phone</th>
                          <th className="text-left py-4 px-4 text-light-400 font-medium">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id} className="border-t border-dark-700 hover:bg-dark-700/50">
                            <td className="py-4 px-4 text-light-100 font-medium">{user.name}</td>
                            <td className="py-4 px-4 text-light-300">{user.email}</td>
                            <td className="py-4 px-4 text-light-300">{user.phone}</td>
                            <td className="py-4 px-4 text-light-400">{formatDate(user.createdAt)}</td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-light-400">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-light-100">Manage Reviews</h2>
                  <p className="text-light-400 text-sm">Approve or reject student reviews before they appear on the website.</p>
                </div>

                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="bg-dark-800 rounded-xl p-8 text-center border border-dark-700">
                      <FiMessageSquare className="mx-auto text-light-400 mb-4" size={48} />
                      <p className="text-light-400">No reviews yet.</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review._id} className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <p className="text-light-100 font-semibold">{review.name}</p>
                              <span className={`px-2 py-1 rounded text-xs ${review.isApproved ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                                {review.isApproved ? 'Approved' : 'Pending'}
                              </span>
                              {review.isSeeded && <span className="px-2 py-1 rounded text-xs bg-primary/20 text-primary">Seeded</span>}
                            </div>
                            <p className="text-light-400 text-sm mb-2">{review.college} • {review.role}</p>
                            <div className="flex space-x-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-600'}>★</span>
                              ))}
                            </div>
                            <p className="text-light-300 text-sm">{review.review}</p>
                            <p className="text-light-500 text-xs mt-2">{formatDate(review.createdAt)}</p>
                          </div>
                          <div className="flex space-x-2">
                            {!review.isApproved && (
                              <button
                                onClick={async () => {
                                  try {
                                    await api.put(`/reviews/${review._id}/approve`, { isApproved: true });
                                    toast.success('Review approved');
                                    fetchData();
                                  } catch { toast.error('Failed to approve'); }
                                }}
                                className="px-4 py-2 bg-success/20 text-success rounded-lg hover:bg-success/30 transition text-sm"
                              >
                                Approve
                              </button>
                            )}
                            {review.isApproved && (
                              <button
                                onClick={async () => {
                                  try {
                                    await api.put(`/reviews/${review._id}/approve`, { isApproved: false });
                                    toast.success('Review hidden');
                                    fetchData();
                                  } catch { toast.error('Failed to hide'); }
                                }}
                                className="px-4 py-2 bg-warning/20 text-warning rounded-lg hover:bg-warning/30 transition text-sm"
                              >
                                Hide
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (!window.confirm('Delete this review?')) return;
                                try {
                                  await api.delete(`/reviews/${review._id}`);
                                  toast.success('Review deleted');
                                  fetchData();
                                } catch { toast.error('Failed to delete'); }
                              }}
                              className="px-4 py-2 bg-error/20 text-error rounded-lg hover:bg-error/30 transition text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Remark Modal */}
      {remarkModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md border border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-light-100">Add Feedback & Complete</h3>
              <button onClick={() => setRemarkModal({ open: false, bookingId: null, remark: '' })}>
                <FiX className="text-light-400 hover:text-light-100" size={24} />
              </button>
            </div>
            <textarea
              value={remarkModal.remark}
              onChange={(e) => setRemarkModal({ ...remarkModal, remark: e.target.value })}
              className="input-field h-32 resize-none mb-4"
              placeholder="Enter feedback for the student..."
            />
            <button onClick={handleAddRemark} className="btn-primary w-full">
              Save & Mark Complete
            </button>
          </div>
        </div>
      )}

      {/* Block Slots Modal */}
      {blockModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-lg border border-dark-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-light-100">Block Slots</h3>
              <button
                onClick={() =>
                  setBlockModal({ open: false, date: null, slots: [], isFullDay: false, reason: '' })
                }
              >
                <FiX className="text-light-400 hover:text-light-100" size={24} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-light-400 text-sm mb-2">Select Date</label>
              <DatePicker
                selected={blockModal.date}
                onChange={(date) => setBlockModal({ ...blockModal, date })}
                minDate={new Date()}
                className="input-field w-full"
                placeholderText="Click to select date"
                dateFormat="dd/MM/yyyy"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center space-x-3 text-light-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={blockModal.isFullDay}
                  onChange={(e) => setBlockModal({ ...blockModal, isFullDay: e.target.checked })}
                  className="w-5 h-5 rounded border-dark-600 bg-dark-700 text-primary focus:ring-primary"
                />
                <span>Block Full Day</span>
              </label>
            </div>

            {!blockModal.isFullDay && (
              <div className="mb-4">
                <label className="block text-light-400 text-sm mb-2">Select Time Slots</label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition ${
                        blockModal.slots.includes(slot)
                          ? 'bg-primary/20 border border-primary'
                          : 'bg-dark-700 border border-dark-600 hover:border-dark-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={blockModal.slots.includes(slot)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBlockModal({ ...blockModal, slots: [...blockModal.slots, slot] });
                          } else {
                            setBlockModal({
                              ...blockModal,
                              slots: blockModal.slots.filter((s) => s !== slot)
                            });
                          }
                        }}
                        className="hidden"
                      />
                      <span className="text-light-300 text-sm">{formatTimeSlot(slot)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-light-400 text-sm mb-2">Reason (Optional)</label>
              <input
                type="text"
                value={blockModal.reason}
                onChange={(e) => setBlockModal({ ...blockModal, reason: e.target.value })}
                className="input-field"
                placeholder="e.g., Holiday, Personal, Meeting"
              />
            </div>

            <button onClick={handleBlockSlots} className="btn-primary w-full">
              Block Selected Slots
            </button>
          </div>
        </div>
      )}

      {/* View Booking Modal */}
      {viewBookingModal.open && viewBookingModal.booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-dark-800 rounded-xl p-6 w-full max-w-md border border-dark-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-light-100">Booking Details</h3>
              <button onClick={() => setViewBookingModal({ open: false, booking: null })}>
                <FiX className="text-light-400 hover:text-light-100" size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-dark-900 rounded-lg p-4">
                <p className="text-light-400 text-sm">User</p>
                <p className="text-light-100 font-medium">{viewBookingModal.booking.userId?.name}</p>
                <p className="text-light-300 text-sm">{viewBookingModal.booking.userId?.email}</p>
                <p className="text-light-300 text-sm">{viewBookingModal.booking.userId?.phone}</p>
              </div>

              <div className="bg-dark-900 rounded-lg p-4">
                <p className="text-light-400 text-sm">Session</p>
                <p className="text-light-100 font-medium">{viewBookingModal.booking.mentorId?.name}</p>
                <p className="text-light-300 text-sm">{formatDate(viewBookingModal.booking.date)}</p>
                <p className="text-light-300 text-sm">
                  {formatTimeSlot(viewBookingModal.booking.timeSlot)}
                </p>
              </div>

              <div className="bg-dark-900 rounded-lg p-4">
                <p className="text-light-400 text-sm">Payment</p>
                <p className="text-light-100 font-medium">₹{viewBookingModal.booking.amount}</p>
                <p className="text-light-300 text-sm">ID: {viewBookingModal.booking.paymentId || 'N/A'}</p>
              </div>

              {viewBookingModal.booking.mentorRemark && (
                <div className="bg-dark-900 rounded-lg p-4">
                  <p className="text-light-400 text-sm">Mentor Feedback</p>
                  <p className="text-light-100">{viewBookingModal.booking.mentorRemark}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
