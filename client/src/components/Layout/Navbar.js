import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';
import AuthModal from '../Auth/AuthModal';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text">College</span>
              <span className="text-xl font-semibold text-light-100">Mate</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="/#about" className="text-light-400 hover:text-light-100 transition">About</a>
              <a href="/#mentors" className="text-light-400 hover:text-light-100 transition">Mentors</a>
              <a href="/#booking" className="text-light-400 hover:text-light-100 transition">Book Session</a>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center space-x-2 text-light-100 hover:text-primary transition"
                  >
                    <FiUser />
                    <span>{user?.name?.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-light-400 hover:text-error transition"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAuth('login')}
                    className="text-light-100 hover:text-primary transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuth('register')}
                    className="btn-primary py-2 px-4 text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-light-100 p-2"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-dark-800 border-t border-dark-700"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="/#about" className="block text-light-400 hover:text-light-100 py-2" onClick={() => setIsOpen(false)}>About</a>
                <a href="/#mentors" className="block text-light-400 hover:text-light-100 py-2" onClick={() => setIsOpen(false)}>Mentors</a>
                <a href="/#booking" className="block text-light-400 hover:text-light-100 py-2" onClick={() => setIsOpen(false)}>Book Session</a>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                      className="block text-light-100 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block text-error py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex space-x-3 pt-2">
                    <button onClick={() => openAuth('login')} className="btn-secondary py-2 px-4 flex-1">Login</button>
                    <button onClick={() => openAuth('register')} className="btn-primary py-2 px-4 flex-1">Sign Up</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;
