'use client';

import React from 'react';
import Image from 'next/image';
import Logo from '../public/images/Logo.svg';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-pink-800 to-indigo-900 text-white relative z-10">
      {/* Top Section - Three Columns */}
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* CONTACT US */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6 text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="w-5 h-5 text-white mt-1 flex-shrink-0" />
                <p className="text-sm leading-relaxed">
                  JK Lakshmipat University, Near Mahindra SEZ, Ajmer Road, Jaipur, Rajasthan 302026
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="w-5 h-5 text-white" />
                <p className="text-sm">+91 141 7107500</p>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="w-5 h-5 text-white" />
                <p className="text-sm">info@jklu.edu.in</p>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6 text-white">Quick Links</h3>
            <div className="space-y-3">
              <a href="/" className="block text-sm hover:text-gray-300 transition-colors">About</a>
              <a href="/FAQ" className="block text-sm hover:text-gray-300 transition-colors">Schedule</a>
              <a href="/Team" className="block text-sm hover:text-gray-300 transition-colors">Speakers</a>
              <a href="https://jklu.edu.in" target="_blank" rel="noopener noreferrer" className="block text-sm hover:text-gray-300 transition-colors">University Website</a>
              <a href="/privacy-policy" className="block text-sm hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="/terms" className="block text-sm hover:text-gray-300 transition-colors">Terms & Conditions</a>
              <a href="/refund-policy" className="block text-sm hover:text-gray-300 transition-colors">Refund & Cancellation Policy</a>
              <a href="/Contact" className="block text-sm hover:text-gray-300 transition-colors">Contact Us</a>
            </div>
          </div>

          {/* FOLLOW US */}
          <div>
            <h3 className="text-lg font-bold uppercase mb-6 text-white">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
            {/* University Campus Image */}
            <div className="w-full h-32 rounded-lg overflow-hidden">
              <Image 
                src="/images/building-6011756_1280.jpg" 
                alt="JK Lakshmipat University Campus" 
                width={300} 
                height={128} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="bg-black/30 px-6 py-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-300">
          <div>
            ©2025 Sabrang - JK Lakshmipat University. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
