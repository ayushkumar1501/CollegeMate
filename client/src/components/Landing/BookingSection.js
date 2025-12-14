import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCheck, FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import AuthModal from '../Auth/AuthModal';
import BookingModal from '../Booking/BookingModal';

const benefits = [
  'Personalized guidance tailored to your goals',
  'Career roadmap and planning',
  'Technical interview preparation',
  'Resume and portfolio review',
  'Industry insights and networking tips',
  'Post-session resources and notes'
];

const BookingSection = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleBookClick = () => {
    if (isAuthenticated) {
      setShowBookingModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section id="booking" className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary font-medium">Book Now</span>
              <h2 className="text-3xl md:text-4xl font-bold text-light-100 mt-2 mb-6">
                Book a 1:1 Session with Abhishek Ranjan and His Team
              </h2>
              
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-light-400 line-through text-2xl">₹500</span>
                <span className="text-4xl font-bold text-accent">₹200</span>
                <span className="text-light-400">/ 1 hour session</span>
              </div>

              <p className="text-light-400 mb-8">
                Get personalized mentorship from experienced tech professionals. Whether you're preparing for placements, learning new technologies, or planning your career path, we're here to guide you.
              </p>

              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
                      <FiCheck className="text-success" size={14} />
                    </span>
                    <span className="text-light-300">{benefit}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                onClick={handleBookClick}
                className="btn-primary text-lg px-8 py-4 w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Book Your Session Now
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8"
            >
              <h3 className="text-xl font-bold text-light-100 mb-6">How It Works</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <FiUser className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="text-light-100 font-semibold mb-1">1. Choose Your Mentor</h4>
                    <p className="text-light-400 text-sm">Select from our team of experienced mentors based on your needs.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <FiCalendar className="text-secondary" size={24} />
                  </div>
                  <div>
                    <h4 className="text-light-100 font-semibold mb-1">2. Pick a Date</h4>
                    <p className="text-light-400 text-sm">Choose a convenient date from our available calendar.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <FiClock className="text-accent" size={24} />
                  </div>
                  <div>
                    <h4 className="text-light-100 font-semibold mb-1">3. Select Time Slot</h4>
                    <p className="text-light-400 text-sm">Pick from available 1-hour slots between 3 PM - 12 AM.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                    <FiCheck className="text-success" size={24} />
                  </div>
                  <div>
                    <h4 className="text-light-100 font-semibold mb-1">4. Complete Payment</h4>
                    <p className="text-light-400 text-sm">Pay securely via Razorpay and receive instant confirmation.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-dark-900/50 rounded-xl">
                <p className="text-light-400 text-sm text-center">
                  💡 You'll receive the meeting link 1 hour before your session
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="register"
      />

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </>
  );
};

export default BookingSection;
