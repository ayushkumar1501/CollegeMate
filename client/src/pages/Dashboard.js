import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCalendar, FiPlus, FiUser, FiClock, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchUserBookings, cancelBooking } from '../redux/slices/bookingSlice';
import { updateProfile, changePassword } from '../redux/slices/authSlice';
import BookingModal from '../components/Booking/BookingModal';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bookings, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchUserBookings());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, phone: user.phone });
    }
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(cancelBooking(bookingId)).unwrap();
        toast.success('Booking cancelled successfully');
      } catch (error) {
        toast.error(error || 'Failed to cancel booking');
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(profileData)).unwrap();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await dispatch(changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })).unwrap();
      toast.success('Password changed successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error || 'Failed to change password');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success/20 text-success';
      case 'completed': return 'bg-primary/20 text-primary';
      case 'cancelled': return 'bg-error/20 text-error';
      default: return 'bg-warning/20 text-warning';
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
    const [start, end] = slot.split('-');
    const formatTime = (time) => {
      const [hours] = time.split(':');
      const h = parseInt(hours);
      if (h === 0 || h === 24) return '12:00 AM';
      if (h === 12) return '12:00 PM';
      return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-light-100">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-light-400 mt-1">Manage your mentorship sessions</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-dark-700">
          {[
            { id: 'bookings', label: 'My Bookings', icon: FiCalendar },
            { id: 'book', label: 'Book Session', icon: FiPlus },
            { id: 'profile', label: 'Profile', icon: FiUser }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => tab.id === 'book' ? setShowBookingModal(true) : setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-light-400 hover:text-light-100'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* My Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-dark-800 rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-dark-700 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-dark-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <FiCalendar className="mx-auto text-light-400 mb-4" size={48} />
                <h3 className="text-xl font-semibold text-light-100 mb-2">No bookings yet</h3>
                <p className="text-light-400 mb-6">Book your first mentorship session today!</p>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="btn-primary"
                >
                  Book a Session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={booking.mentorId?.photo || 'https://via.placeholder.com/60'}
                          alt={booking.mentorId?.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-light-100 font-semibold">{booking.mentorId?.name}</h3>
                          <div className="flex items-center space-x-4 text-light-400 text-sm mt-1">
                            <span className="flex items-center">
                              <FiCalendar className="mr-1" />
                              {formatDate(booking.date)}
                            </span>
                            <span className="flex items-center">
                              <FiClock className="mr-1" />
                              {formatTimeSlot(booking.timeSlot)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-error hover:underline text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {booking.mentorRemark && (
                      <div className="mt-4 p-4 bg-dark-900/50 rounded-lg">
                        <p className="text-light-400 text-sm flex items-start">
                          <FiMessageSquare className="mr-2 mt-1 flex-shrink-0 text-primary" />
                          <span><strong className="text-light-100">Mentor's Feedback:</strong> {booking.mentorRemark}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 mb-6">
              <h3 className="text-lg font-semibold text-light-100 mb-4">Personal Information</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-light-400 text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-light-400 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-field opacity-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-light-400 text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Update Profile
                </button>
              </form>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h3 className="text-lg font-semibold text-light-100 mb-4">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-light-400 text-sm mb-2">Current Password</label>
                  <input
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-light-400 text-sm mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-light-400 text-sm mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Change Password
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </div>

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
};

export default Dashboard;
