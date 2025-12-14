import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiCalendar, FiMail } from 'react-icons/fi';

const BookingSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiCheckCircle className="text-success" size={48} />
        </motion.div>

        <h1 className="text-3xl font-bold text-light-100 mb-4">Booking Confirmed!</h1>
        <p className="text-light-400 mb-8">
          Your mentorship session has been successfully booked. We've sent a confirmation email with all the details.
        </p>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 mb-8">
          <div className="flex items-center justify-center space-x-2 text-light-300 mb-4">
            <FiMail className="text-primary" />
            <span>Check your email for booking details</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-light-300">
            <FiCalendar className="text-primary" />
            <span>Meeting link will be sent 1 hour before session</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard" className="btn-primary">
            View My Bookings
          </Link>
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;
