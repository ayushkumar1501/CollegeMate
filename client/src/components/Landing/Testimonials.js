import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar, FiEdit3, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const swiperRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    review: '',
    college: '',
    role: 'Student'
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews');
      setReviews(res.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.review.length < 20) {
      toast.error('Review must be at least 20 characters');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/reviews', formData);
      toast.success('Review submitted! It will appear after admin approval.');
      setShowForm(false);
      setFormData({ rating: 5, review: '', college: '', role: 'Student' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrev = () => swiperRef.current?.swiper?.slidePrev();
  const handleNext = () => swiperRef.current?.swiper?.slideNext();

  const renderStars = (rating, interactive = false, onSelect = null) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} ${interactive ? 'cursor-pointer hover:scale-110 transition' : ''}`}
        size={interactive ? 24 : 16}
        onClick={() => interactive && onSelect && onSelect(i + 1)}
      />
    ));
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-success', 'bg-purple-500', 'bg-pink-500'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <section className="py-20 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-light-100 mt-2 mb-4">What Our Students Say</h2>
          <p className="text-light-400 max-w-2xl mx-auto">Real reviews from students who transformed their careers with CollegeMate.</p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center space-x-2 bg-dark-800 px-4 py-2 rounded-full">
              <span className="text-yellow-400 font-bold">4.9</span>
              <div className="flex">{renderStars(5)}</div>
              <span className="text-light-400 text-sm">Average Rating</span>
            </div>
            <div className="bg-dark-800 px-4 py-2 rounded-full">
              <span className="text-light-100 font-bold">200+</span>
              <span className="text-light-400 text-sm ml-2">Students Mentored</span>
            </div>
            <div className="bg-dark-800 px-4 py-2 rounded-full">
              <span className="text-success font-bold">95%</span>
              <span className="text-light-400 text-sm ml-2">Satisfaction Rate</span>
            </div>
          </div>
        </motion.div>

        {/* Reviews Carousel */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="relative">
            <button onClick={handlePrev} className="absolute left-0 md:-left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-dark-800/90 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 border border-primary/50 hover:border-primary shadow-lg backdrop-blur-sm" aria-label="Previous">
              <FiChevronLeft className="text-white" size={22} />
            </button>
            <button onClick={handleNext} className="absolute right-0 md:-right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-dark-800/90 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 border border-primary/50 hover:border-primary shadow-lg backdrop-blur-sm" aria-label="Next">
              <FiChevronRight className="text-white" size={22} />
            </button>

            <div className="px-10 md:px-14">
              <Swiper
                ref={swiperRef}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                loop={reviews.length > 3}
                speed={500}
                grabCursor={true}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                breakpoints={{ 768: { slidesPerView: 2, spaceBetween: 24 }, 1024: { slidesPerView: 3, spaceBetween: 28 } }}
                className="pb-14 testimonial-swiper"
              >
                {reviews.map((review, index) => (
                  <SwiperSlide key={review._id || index}>
                    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.25 }} className="bg-dark-800 rounded-2xl p-6 h-full border border-dark-700 hover:border-primary/30 transition-colors">
                      <div className="text-primary/20 text-6xl font-serif leading-none mb-2">"</div>
                      <div className="flex space-x-1 mb-4">{renderStars(review.rating)}</div>
                      <p className="text-light-300 text-sm leading-relaxed mb-6 line-clamp-5">{review.review}</p>
                      <div className="flex items-center mt-auto">
                        <div className={`w-12 h-12 rounded-full ${getAvatarColor(review.name)} flex items-center justify-center text-white font-bold`}>
                          {getInitials(review.name)}
                        </div>
                        <div className="ml-3">
                          <p className="text-light-100 font-semibold text-sm">{review.name}</p>
                          <p className="text-primary text-xs">{review.role}{review.college ? ` • ${review.college}` : ''}</p>
                        </div>
                      </div>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ) : (
          <p className="text-center text-light-400 py-12">No reviews yet. Be the first to share your experience!</p>
        )}

        {/* Write Review CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
          {isAuthenticated ? (
            <button onClick={() => setShowForm(true)} className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
              <FiEdit3 size={18} />
              <span>Share Your Experience</span>
            </button>
          ) : (
            <p className="text-light-400">
              <a href="#booking" className="text-primary hover:underline">Login</a> to share your review
            </p>
          )}
        </motion.div>
      </div>

      {/* Review Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowForm(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-dark-800 rounded-2xl p-6 w-full max-w-lg relative border border-dark-700" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-light-400 hover:text-light-100 transition"><FiX size={24} /></button>
              
              <h3 className="text-xl font-bold text-light-100 mb-2">Share Your Experience</h3>
              <p className="text-light-400 text-sm mb-6">Your review helps other students make informed decisions.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-light-400 text-sm mb-2">Your Rating</label>
                  <div className="flex space-x-2">{renderStars(formData.rating, true, (r) => setFormData({ ...formData, rating: r }))}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-light-400 text-sm mb-2">College (Optional)</label>
                    <input type="text" value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })} className="input-field" placeholder="e.g., NIT Trichy" />
                  </div>
                  <div>
                    <label className="block text-light-400 text-sm mb-2">Current Role</label>
                    <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="input-field" placeholder="e.g., 3rd Year CSE" />
                  </div>
                </div>

                <div>
                  <label className="block text-light-400 text-sm mb-2">Your Review <span className="text-error">*</span></label>
                  <textarea value={formData.review} onChange={(e) => setFormData({ ...formData, review: e.target.value })} className="input-field min-h-[120px] resize-none" placeholder="Share how CollegeMate helped you..." maxLength={500} />
                  <p className="text-light-500 text-xs mt-1">{formData.review.length}/500 characters</p>
                </div>

                <button type="submit" disabled={submitting} className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50">
                  {submitting ? <span>Submitting...</span> : <><FiCheck size={18} /><span>Submit Review</span></>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .testimonial-swiper .swiper-pagination-bullet { width: 8px; height: 8px; background: #475569; opacity: 1; transition: all 0.3s ease; }
        .testimonial-swiper .swiper-pagination-bullet-active { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); width: 24px; border-radius: 4px; }
        .testimonial-swiper .swiper-slide { height: auto; }
        .testimonial-swiper .swiper-wrapper { align-items: stretch; }
      `}</style>
    </section>
  );
};

export default Testimonials;
