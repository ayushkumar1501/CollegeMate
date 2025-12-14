import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiLink, FiCreditCard, FiSend, FiCheckCircle, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const issueTypes = [
  { id: 'payment_failure', label: 'Payment Failed / Money Deducted', icon: FiCreditCard, description: 'Payment was deducted but booking not confirmed' },
  { id: 'meeting_link', label: 'Meeting Link Issue', icon: FiLink, description: 'Did not receive meeting link or link not working' },
  { id: 'reschedule', label: 'Reschedule Request', icon: FiAlertCircle, description: 'Request to change your booking date/time' },
  { id: 'other', label: 'Other Issue', icon: FiAlertCircle, description: 'Any other booking or payment related issue' }
];

const SupportForm = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    issueType: '',
    transactionId: '',
    bookingDate: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Auto-fill user data when logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.issueType || !formData.message) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.issueType === 'payment_failure' && !formData.transactionId) {
      toast.error('Transaction ID is required for payment issues');
      return;
    }

    setLoading(true);
    try {
      await api.post('/support/submit', formData);
      setSubmitted(true);
      toast.success('Support request submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Not logged in - show login prompt
  if (!isAuthenticated) {
    return (
      <section id="support" className="py-20 bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary font-medium">Need Help?</span>
            <h2 className="text-3xl md:text-4xl font-bold text-light-100 mt-2 mb-4">
              Support & Assistance
            </h2>
            <p className="text-light-400 max-w-2xl mx-auto">
              Facing issues with payment or meeting link? Login to submit a support request.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-dark-900 rounded-2xl p-8 md:p-12 border border-dark-700 text-center"
          >
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiLock className="text-primary" size={36} />
            </div>
            <h3 className="text-xl font-bold text-light-100 mb-3">Login Required</h3>
            <p className="text-light-400 mb-6 max-w-md mx-auto">
              Please login to your account to submit a support request. This helps us verify your bookings and resolve issues faster.
            </p>
            
          </motion.div>
        </div>
      </section>
    );
  }

  // Submitted successfully
  if (submitted) {
    return (
      <section id="support" className="py-20 bg-dark-800">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-dark-900 rounded-2xl p-10 border border-dark-700"
          >
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-success" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-light-100 mb-3">Request Submitted!</h3>
            <p className="text-light-400 mb-6">
              We've received your support request. Our team will review it and get back to you within 24-48 hours at <span className="text-primary">{user.email}</span>.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: user.name || '',
                  email: user.email || '',
                  phone: user.phone || '',
                  issueType: '',
                  transactionId: '',
                  bookingDate: '',
                  message: ''
                });
              }}
              className="text-primary hover:underline"
            >
              Submit Another Request
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  // Logged in - show form
  return (
    <section id="support" className="py-20 bg-dark-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium">Need Help?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-light-100 mt-2 mb-4">
            Support & Assistance
          </h2>
          <p className="text-light-400 max-w-2xl mx-auto">
            Facing issues with payment or meeting link? Fill out the form below and we'll resolve it as soon as possible.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-dark-900 rounded-2xl p-6 md:p-8 border border-dark-700"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Type Selection */}
            <div>
              <label className="block text-light-300 font-medium mb-3">
                What issue are you facing? <span className="text-error">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {issueTypes.map((type) => (
                  <label
                    key={type.id}
                    className={`flex items-start p-4 rounded-xl cursor-pointer transition-all border ${
                      formData.issueType === type.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-dark-800 border-dark-700 hover:border-dark-600'
                    }`}
                  >
                    <input type="radio" name="issueType" value={type.id} checked={formData.issueType === type.id} onChange={handleChange} className="hidden" />
                    <type.icon className={`mt-0.5 mr-3 flex-shrink-0 ${formData.issueType === type.id ? 'text-primary' : 'text-light-400'}`} size={20} />
                    <div>
                      <p className={`font-medium ${formData.issueType === type.id ? 'text-primary' : 'text-light-100'}`}>{type.label}</p>
                      <p className="text-light-400 text-xs mt-1">{type.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* User Info - Auto-filled and readonly */}
            <div className="bg-dark-800/50 rounded-xl p-4 border border-dark-700">
              <p className=" text-sm mb-3">Your account details<sup className='text-red-800'>*</sup><p className='text-red-400'>(You must update your profile with all correct details)</p></p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-light-500 text-xs mb-1">Name</label>
                  <p className="text-light-100 font-medium">{formData.name}</p>
                </div>
                <div>
                  <label className="block text-light-500 text-xs mb-1">Email</label>
                  <p className="text-light-100 font-medium">{formData.email}</p>
                </div>
                <div>
                  <label className="block text-light-500 text-xs mb-1">Phone</label>
                  <p className="text-light-100 font-medium">{formData.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-light-400 text-sm mb-2">Booking Date (if applicable)</label>
                <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} className="input-field" />
              </div>
              {formData.issueType === 'payment_failure' && (
                <div>
                  <label className="block text-light-400 text-sm mb-2">Transaction ID <span className="text-error">*</span></label>
                  <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} className="input-field" placeholder="e.g., pay_xxxxxxxxxxxxx" required />
                </div>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-light-400 text-sm mb-2">Describe Your Issue <span className="text-error">*</span></label>
              <textarea name="message" value={formData.message} onChange={handleChange} className="input-field min-h-[120px] resize-none" placeholder="Please provide details about your issue..." required />
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50">
              {loading ? <span>Submitting...</span> : <><FiSend size={18} /><span>Submit Support Request</span></>}
            </button>

           
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default SupportForm;
