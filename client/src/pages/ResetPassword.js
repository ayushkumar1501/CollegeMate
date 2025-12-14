import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error('Password must have at least 8 characters with uppercase, lowercase, number, and special character');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successful! Please login.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-800 rounded-2xl p-8 w-full max-w-md border border-dark-700"
      >
        <h2 className="text-2xl font-bold text-light-100 mb-2">Reset Password</h2>
        <p className="text-light-400 mb-6">Enter your new password below</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-light-400 text-sm mb-2">New Password</label>
            <div className="relative">
              <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-light-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-light-400 text-sm mb-2">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute right-3 top-1/2 -translate-y-1/2 text-light-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
