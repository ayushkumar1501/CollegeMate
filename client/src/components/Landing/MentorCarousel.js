import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiLinkedin, FiInstagram, FiAward, FiUsers, FiStar } from 'react-icons/fi';

const MentorCarousel = () => {
  const { mentors, loading } = useSelector((state) => state.mentor);

  if (loading) {
    return (
      <section id="mentors" className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-dark-700 rounded w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-dark-700 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // Get the main mentor (Abhishek Ranjan)
  const mentor = mentors[0];

  if (!mentor) {
    return (
      <section id="mentors" className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-light-400">Loading mentor...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="mentors" className="py-20 bg-dark-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium">Your Mentor</span>
          <h2 className="text-3xl md:text-4xl font-bold text-light-100 mt-2 mb-4">
            Meet Your Expert Guide
          </h2>
          <p className="text-light-400 max-w-2xl mx-auto">
            Get personalized 1:1 mentorship from an industry expert who has helped hundreds of students achieve their career goals.
          </p>
        </motion.div>

        {/* Featured Mentor Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-dark-900 to-dark-800 rounded-3xl p-8 md:p-10 border border-primary/20 shadow-2xl shadow-primary/5">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Photo */}
              <div className="relative flex-shrink-0">
                <div className="w-48 h-48 md:w-56 md:h-56 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full opacity-30 blur-xl animate-pulse"></div>
                  <img
                    src={mentor.photo}
                    alt={mentor.name}
                    className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-primary/50 relative z-10 shadow-xl"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg z-20">
                  <FiAward className="inline mr-1" /> Lead Mentor
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-light-100 mb-3">
                  {mentor.name}
                </h3>
                <p className="text-light-400 leading-relaxed mb-6">
                  {mentor.bio}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                  <div className="bg-dark-700/50 px-4 py-2 rounded-lg flex items-center space-x-2">
                    <FiUsers className="text-primary" />
                    <span className="text-light-100 font-semibold">200+</span>
                    <span className="text-light-400 text-sm">Students</span>
                  </div>
                  <div className="bg-dark-700/50 px-4 py-2 rounded-lg flex items-center space-x-2">
                    <FiStar className="text-yellow-400" />
                    <span className="text-light-100 font-semibold">4.9</span>
                    <span className="text-light-400 text-sm">Rating</span>
                  </div>
                  <div className="bg-dark-700/50 px-4 py-2 rounded-lg flex items-center space-x-2">
                    <FiAward className="text-success" />
                    <span className="text-light-100 font-semibold">20+</span>
                    <span className="text-light-400 text-sm">Internships</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex justify-center md:justify-start space-x-4">
                  {mentor.linkedIn && (
                    <a
                      href={mentor.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-all duration-300"
                    >
                      <FiLinkedin size={18} />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                  )}
                  {mentor.instagram && (
                    <a
                      href={mentor.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-pink-600/20 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-pink-400 hover:text-white rounded-lg transition-all duration-300"
                    >
                      <FiInstagram size={18} />
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Expertise Tags */}
            <div className="mt-8 pt-6 border-t border-dark-700">
              <p className="text-light-400 text-sm mb-3 text-center md:text-left">Areas of Expertise:</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {['Full-Stack Development', 'System Design', 'DSA', 'Career Guidance', 'Interview Prep', 'Resume Review'].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="#booking"
            className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            Book a Session with {mentor.name.split(' ')[0]} →
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MentorCarousel;
