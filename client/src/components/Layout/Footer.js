import React from 'react';
import { FiLinkedin, FiInstagram, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 ">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold gradient-text">College</span>
              <span className="text-xl font-semibold text-light-100">Mate</span>
            </div>
            <p className="text-light-400 mb-4 max-w-md">
              Get the correct direction and path from our guidance. We're here to support you and make you better in your tech career journey.
            </p>
            <div className="flex space-x-4">
              <a href="https://linkedin.com/in/abhishek-ranjan-54838b274" target="_blank" rel="noopener noreferrer" className="text-light-400 hover:text-primary transition">
                <FiLinkedin size={24} />
              </a>
              <a href="https://www.instagram.com/abhishekranjan714/" target="_blank" rel="noopener noreferrer" className="text-light-400 hover:text-primary transition">
                <FiInstagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-light-100 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/#about" className="text-light-400 hover:text-light-100 transition">About Us</a></li>
              <li><a href="/#mentors" className="text-light-400 hover:text-light-100 transition">Our Mentors</a></li>
              <li><a href="/#booking" className="text-light-400 hover:text-light-100 transition">Book Session</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-light-100 font-semibold mb-4">Policies</h4>
            <ul className="space-y-2">
              <li><a href="https://merchant.razorpay.com/policy/RqnjVGcMnhsE3O/terms" target="_blank" rel="noopener noreferrer" className="text-light-400 hover:text-light-100 transition">Terms & Conditions</a></li>
              <li><a href="https://merchant.razorpay.com/policy/RqnjVGcMnhsE3O/refund" target="_blank" rel="noopener noreferrer" className="text-light-400 hover:text-light-100 transition">Cancellation & Refunds</a></li>
              <li><a href="https://merchant.razorpay.com/policy/RqnjVGcMnhsE3O/shipping" target="_blank" rel="noopener noreferrer" className="text-light-400 hover:text-light-100 transition">Shipping Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-light-100 font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-light-400">
                <FiMail />
                <span>abhiself28@gmail.com</span>
              </li>
              
            </ul>
          </div>
        </div>

       
          
          {/* Developer Credit */}
          <div className="text-center pt-4 border-t border-dark-700">
            <p className="text-light-500 text-xs mb-2">
              Website Developed & Maintained by
            </p>
            <p className="text-light-300 font-semibold text-sm mb-2">
              Ayush
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://www.linkedin.com/in/ayush-kumar-177778888888888962/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-light-500 hover:text-primary transition flex items-center space-x-1 text-xs"
              >
                <FiLinkedin size={14} />
                <span>LinkedIn</span>
              </a>
              <a 
                href="https://www.instagram.com/ayush_kumar.1/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-light-500 hover:text-primary transition flex items-center space-x-1 text-xs"
              >
                <FiInstagram size={14} />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>
         <div className="border-t border-dark-700 mt-8 pt-8">
          <div className="text-center mb-4">
            <p className="text-light-400 text-sm">
              © {new Date().getFullYear()} CollegeMate. All rights reserved.
            </p>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
