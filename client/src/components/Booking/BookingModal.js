import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { FiX, FiCalendar, FiClock, FiUser, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchAvailability, createBooking } from '../../redux/slices/bookingSlice';
import api from '../../services/api';

const BookingModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [processing, setProcessing] = useState(false);

  const dispatch = useDispatch();
  const { mentors } = useSelector((state) => state.mentor);
  const { availableSlots, loading } = useSelector((state) => state.booking);

  useEffect(() => {
    if (selectedDate && selectedMentor) {
      dispatch(fetchAvailability({
        date: selectedDate.toISOString().split('T')[0],
        mentorId: selectedMentor._id
      }));
    }
  }, [selectedDate, selectedMentor, dispatch]);

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

  const handlePayment = async () => {
    if (!selectedMentor || !selectedDate || !selectedSlot) {
      toast.error('Please complete all selections');
      return;
    }

    setProcessing(true);

    // Show warning toast
    toast('⚠️ Please do not close or refresh this page until payment is complete', {
      duration: 6000,
      icon: '🔒',
      style: {
        background: '#1e293b',
        color: '#f1f5f9',
        border: '1px solid #f59e0b',
        padding: '16px',
        fontWeight: '500'
      }
    });

    try {
      // Create order
      const orderResponse = await api.post('/payment/create-order', {
        mentorId: selectedMentor._id,
        date: selectedDate.toISOString().split('T')[0],
        timeSlot: selectedSlot
      });

      const { order, key } = orderResponse.data;

      // Initialize Razorpay
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'CollegeMate',
        description: '1:1 Mentorship Session',
        order_id: order.id,
        handler: async (response) => {
          try {
            // Verify payment
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            // Create booking
            await dispatch(createBooking({
              mentorId: selectedMentor._id,
              date: selectedDate.toISOString().split('T')[0],
              timeSlot: selectedSlot,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id
            })).unwrap();

            toast.success('Booking confirmed! Check your email for details.');
            onClose();
            resetForm();
            window.location.href = '/booking-success';
          } catch (error) {
            toast.error('Booking failed. Please contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#6366f1'
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment initialization failed');
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedMentor(null);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-dark-800 rounded-2xl p-6 w-full max-w-2xl relative border border-dark-700 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-light-400 hover:text-light-100 transition"
          >
            <FiX size={24} />
          </button>

          <h2 className="text-2xl font-bold text-light-100 mb-6">Book Your Session</h2>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                    step >= s ? 'bg-primary text-white' : 'bg-dark-700 text-light-400'
                  }`}
                >
                  {step > s ? <FiCheck /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 sm:w-24 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-dark-700'}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Select Mentor */}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-light-100 mb-4 flex items-center">
                <FiUser className="mr-2 text-primary" /> Select Mentor
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {mentors.map((mentor) => (
                  <button
                    key={mentor._id}
                    onClick={() => setSelectedMentor(mentor)}
                    className={`p-4 rounded-xl border-2 transition text-left ${
                      selectedMentor?._id === mentor._id
                        ? 'border-primary bg-primary/10'
                        : 'border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <img
                      src={mentor.photo}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-full object-cover mb-3"
                    />
                    <p className="text-light-100 font-semibold">{mentor.name}</p>
                  </button>
                ))}
              </div>
              <button
                onClick={() => selectedMentor && setStep(2)}
                disabled={!selectedMentor}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-light-100 mb-4 flex items-center">
                <FiCalendar className="mr-2 text-primary" /> Select Date & Time
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-light-400 text-sm mb-2">Select Date</label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    minDate={new Date()}
                    inline
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-light-400 text-sm mb-2">
                    <FiClock className="inline mr-1" /> Available Slots
                  </label>
                  {!selectedDate ? (
                    <p className="text-light-400 text-sm">Please select a date first</p>
                  ) : loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-dark-700 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-light-400 text-sm">No slots available for this date</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`w-full p-3 rounded-lg border-2 transition text-left ${
                            selectedSlot === slot
                              ? 'border-primary bg-primary/10 text-light-100'
                              : 'border-dark-700 hover:border-dark-600 text-light-400'
                          }`}
                        >
                          {formatTimeSlot(slot)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                  Back
                </button>
                <button
                  onClick={() => selectedSlot && setStep(3)}
                  disabled={!selectedSlot}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm & Pay */}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-light-100 mb-4">Confirm Booking</h3>
              
              <div className="bg-dark-900/50 rounded-xl p-6 mb-6">
                <div className="flex items-center mb-4">
                  <img
                    src={selectedMentor?.photo}
                    alt={selectedMentor?.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="text-light-100 font-semibold">{selectedMentor?.name}</p>
                    <p className="text-light-400 text-sm">1:1 Mentorship Session</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-dark-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-light-400">Date</span>
                    <span className="text-light-100">
                      {selectedDate?.toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-400">Time</span>
                    <span className="text-light-100">{formatTimeSlot(selectedSlot)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-400">Duration</span>
                    <span className="text-light-100">1 Hour</span>
                  </div>
                  <div className="flex justify-between border-t border-dark-700 pt-3">
                    <span className="text-light-100 font-semibold">Total Amount</span>
                    <span className="text-accent font-bold text-xl">₹200</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Pay ₹200'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
