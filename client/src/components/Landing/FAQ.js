import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqs = [
  {
    question: 'How do I book a mentorship session?',
    answer: 'Simply click on "Book Your Session" button, select your preferred date and time slot, complete the payment of ₹200, and you\'re all set! You\'ll receive a confirmation email with all the details.'
  },
  {
    question: 'What topics can I discuss during the session?',
    answer: 'You can discuss anything related to your tech career - DSA preparation, system design, resume review, interview preparation, career guidance, project ideas, placement strategies, or any technical doubts you have.'
  },
  {
    question: 'How will I receive the meeting link?',
    answer: 'You will receive the Google Meet/Zoom link via email 1 hour before your scheduled session. Make sure to check your inbox and spam folder.'
  },
  {
    question: 'Can I reschedule or cancel my booking?',
    answer: 'You can cancel your booking from your dashboard, but please note that refunds are not available once payment is made. For rescheduling, please contact us before your session time and we\'ll try to accommodate your request.'
  },
  {
    question: 'What if I face payment issues?',
    answer: 'If your payment failed but money was deducted, please use our Support Form below with your transaction ID. We\'ll resolve it within 24-48 hours. Note: Refunds are not available for completed payments - the deducted amount will be adjusted for your booking.'
  },
  {
    question: 'Is refund available?',
    answer: 'No, refunds are not available once payment is successfully made. Please make sure you are available on your selected date and time before booking. In case of payment failure where money was deducted, we will either complete your booking or resolve the issue.'
  },
  {
    question: 'How long is each mentorship session?',
    answer: 'Each session is 1 hour long. We recommend preparing your questions beforehand to make the most of your time with the mentor.'
  },
  {
    question: 'Do I need any prior experience?',
    answer: 'No prior experience is required! Whether you\'re a complete beginner or preparing for FAANG interviews, our mentorship is tailored to your current level and goals.'
  },
  {
    question: 'Will I get any resources after the session?',
    answer: 'Yes! Based on your discussion, the mentor may share relevant resources, roadmaps, or study materials. You\'ll also receive feedback and action items via email.'
  }
];

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-dark-700 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left hover:text-primary transition-colors"
      >
        <span className="text-light-100 font-medium pr-4">{faq.question}</span>
        <span className="flex-shrink-0 w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center">
          {isOpen ? (
            <FiMinus className="text-primary" size={18} />
          ) : (
            <FiPlus className="text-light-400" size={18} />
          )}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-light-400 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold text-light-100 mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-light-400">
            Got questions? We've got answers. If you can't find what you're looking for, feel free to contact us.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-dark-800 rounded-2xl p-6 md:p-8 border border-dark-700"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
