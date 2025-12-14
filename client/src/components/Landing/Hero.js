import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowDown } from 'react-icons/fi';

const Hero = () => {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-dark-900 to-secondary/20"></div>
      
      {/* Animated circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-6">
            🚀 Transform Your Tech Career
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-light-100 mb-6 leading-tight">
            Get the <span className="gradient-text">Correct Direction</span>
            <br />and Path from Our Guidance
          </h1>
          
          <p className="text-lg md:text-xl text-light-400 max-w-3xl mx-auto mb-8">
            We're here to support you and make you better. Book personalized 1:1 mentorship sessions with experienced tech professionals and accelerate your career growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              onClick={scrollToBooking}
              className="btn-primary text-lg px-8 py-4 animate-pulse-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Your Session
            </motion.button>
            <a
              href="#about"
              className="btn-secondary text-lg px-8 py-4"
            >
              Learn More
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-light-400">
            <div className="text-center">
              <p className="text-3xl font-bold text-light-100">200+</p>
              <p className="text-sm">Students Mentored</p>
            </div>
            <div className="w-px h-12 bg-dark-700"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-light-100">4.9★</p>
              <p className="text-sm">Average Rating</p>
            </div>
            <div className="w-px h-12 bg-dark-700"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-light-100">₹200</p>
              <p className="text-sm">Per Session</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#about" className="text-light-400 hover:text-light-100 transition animate-bounce block">
            <FiArrowDown size={28} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
