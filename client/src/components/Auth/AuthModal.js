import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { register, login, googleLogin, verifyOtp, resendOtp, clearError, clearVerification } from '../../redux/slices/authSlice';
import api from '../../services/api';

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const { useGoogleLogin } = require('@react-oauth/google');
  const handleGoogleLogin = useGoogleLogin({ onSuccess, onError: () => onError() });
  return (
    <button onClick={() => handleGoogleLogin()} className="w-full flex items-center justify-center space-x-2 bg-white text-dark-900 py-3 rounded-lg font-medium hover:bg-light-200 transition mb-6">
      <FcGoogle size={20} />
      <span>Continue with Google</span>
    </button>
  );
};

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user, requiresVerification, verificationEmail } = useSelector((state) => state.auth);

  useEffect(() => { setMode(initialMode); }, [initialMode]);

  useEffect(() => {
    if (isAuthenticated && user && isOpen && !hasShownWelcome) {
      setHasShownWelcome(true);
      onClose();
      toast.success('Welcome to CollegeMate!', { id: 'welcome-toast' });
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [isAuthenticated, user, isOpen, hasShownWelcome, onClose, navigate]);

  useEffect(() => {
    if (error) { toast.error(error, { id: 'auth-error' }); dispatch(clearError()); }
  }, [error, dispatch]);
  
  useEffect(() => { if (isOpen) setHasShownWelcome(false); }, [isOpen]);
  useEffect(() => { if (resendTimer > 0) { const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000); return () => clearTimeout(t); } }, [resendTimer]);
  useEffect(() => { if (requiresVerification && verificationEmail) { toast.success('OTP sent to your email!', { id: 'otp-sent' }); setResendTimer(60); } }, [requiresVerification, verificationEmail]);

  const validateForm = () => {
    const newErrors = {};
    if (mode === 'register') {
      if (!formData.name || formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
      if (!formData.phone || !/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (mode === 'register' && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = 'Password must have uppercase, lowercase, number, and special character';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => { e.preventDefault(); if (!validateForm()) return; dispatch(mode === 'login' ? login({ email: formData.email, password: formData.password }) : register(formData)); };
  const handleOtpSubmit = (e) => { e.preventDefault(); if (otp.length !== 6) { toast.error('Please enter a valid 6-digit OTP'); return; } dispatch(verifyOtp({ email: verificationEmail, otp })); };
  const handleResendOtp = () => { if (resendTimer > 0) return; dispatch(resendOtp(verificationEmail)); setResendTimer(60); toast.success('OTP resent!', { id: 'otp-resent' }); };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }).then(res => res.json());
      dispatch(googleLogin({ googleId: userInfo.sub, email: userInfo.email, name: userInfo.name }));
    } catch { toast.error('Google login failed'); }
  };

  const handleForgotPassword = async (e) => { e.preventDefault(); try { await api.post('/auth/forgot-password', { email: forgotEmail }); toast.success('Password reset email sent!'); setShowForgot(false); } catch (err) { toast.error(err.response?.data?.message || 'Failed to send reset email'); } };
  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' }); };
  const handleClose = () => { dispatch(clearVerification()); setOtp(''); onClose(); };

  if (!isOpen) return null;

  if (requiresVerification && verificationEmail) {
    return (
      <AnimatePresence>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-dark-800 rounded-2xl p-8 w-full max-w-md relative border border-dark-700" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleClose} className="absolute top-4 right-4 text-light-400 hover:text-light-100 transition"><FiX size={24} /></button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4"><FiMail className="text-primary" size={32} /></div>
              <h2 className="text-2xl font-bold text-light-100 mb-2">Verify Your Email</h2>
              <p className="text-light-400 text-sm">We've sent a 6-digit OTP to<br /><span className="text-primary font-medium">{verificationEmail}</span></p>
            </div>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-light-400 text-sm mb-2">Enter OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="input-field text-center text-2xl tracking-widest font-mono" placeholder="000000" maxLength={6} autoFocus />
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full disabled:opacity-50">{loading ? 'Verifying...' : 'Verify OTP'}</button>
            </form>
            <div className="text-center mt-6">
              <p className="text-light-400 text-sm">Didn't receive the code? {resendTimer > 0 ? <span className="text-light-500">Resend in {resendTimer}s</span> : <button onClick={handleResendOtp} className="text-primary hover:underline" disabled={loading}>Resend OTP</button>}</p>
            </div>
            <button onClick={() => { dispatch(clearVerification()); setOtp(''); }} className="text-light-400 text-sm hover:text-light-100 w-full text-center mt-4">← Back to {mode === 'register' ? 'Sign Up' : 'Login'}</button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-dark-800 rounded-2xl p-8 w-full max-w-md relative border border-dark-700" onClick={(e) => e.stopPropagation()}>
          <button onClick={handleClose} className="absolute top-4 right-4 text-light-400 hover:text-light-100 transition"><FiX size={24} /></button>
          {showForgot ? (
            <>
              <h2 className="text-2xl font-bold text-light-100 mb-6">Reset Password</h2>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div><label className="block text-light-400 text-sm mb-2">Email</label><div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-light-400" /><input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="input-field pl-10" placeholder="Enter your email" required /></div></div>
                <button type="submit" className="btn-primary w-full">Send Reset Link</button>
                <button type="button" onClick={() => setShowForgot(false)} className="text-primary text-sm hover:underline w-full text-center">Back to Login</button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-light-100 mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-light-400 mb-6">{mode === 'login' ? 'Login to continue your journey' : 'Start your mentorship journey today'}</p>
              {googleClientId && (<><GoogleLoginButton onSuccess={handleGoogleSuccess} onError={() => toast.error('Google login failed')} /><div className="flex items-center mb-6"><div className="flex-1 border-t border-dark-700"></div><span className="px-4 text-light-400 text-sm">or</span><div className="flex-1 border-t border-dark-700"></div></div></>)}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (<><div><label className="block text-light-400 text-sm mb-2">Full Name</label><div className="relative"><FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-light-400" /><input type="text" name="name" value={formData.name} onChange={handleChange} className={`input-field pl-10 ${errors.name ? 'border-error' : ''}`} placeholder="John Doe" /></div>{errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}</div><div><label className="block text-light-400 text-sm mb-2">Phone Number</label><div className="relative"><FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-light-400" /><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`input-field pl-10 ${errors.phone ? 'border-error' : ''}`} placeholder="9876543210" /></div>{errors.phone && <p className="text-error text-xs mt-1">{errors.phone}</p>}</div></>)}
                <div><label className="block text-light-400 text-sm mb-2">Email</label><div className="relative"><FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-light-400" /><input type="email" name="email" value={formData.email} onChange={handleChange} className={`input-field pl-10 ${errors.email ? 'border-error' : ''}`} placeholder="you@example.com" /></div>{errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}</div>
                <div><label className="block text-light-400 text-sm mb-2">Password</label><div className="relative"><FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-light-400" /><input type="password" name="password" value={formData.password} onChange={handleChange} className={`input-field pl-10 ${errors.password ? 'border-error' : ''}`} placeholder="••••••••" /></div>{errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}</div>
                {mode === 'login' && <button type="button" onClick={() => setShowForgot(true)} className="text-primary text-sm hover:underline">Forgot Password?</button>}
                <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}</button>
              </form>
              <p className="text-center text-light-400 mt-6">{mode === 'login' ? "Don't have an account? " : 'Already have an account? '}<button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-primary hover:underline">{mode === 'login' ? 'Sign Up' : 'Login'}</button></p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
