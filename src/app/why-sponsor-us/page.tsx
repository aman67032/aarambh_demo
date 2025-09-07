"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Building, Clock, MessageCircle, Send } from 'lucide-react';

interface FormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  sponsorshipAmount: string;
  preferredTiming: string;
  eventInterests: string[];
  additionalRequests: string;
}

const WhySponsorUs = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    sponsorshipAmount: '',
    preferredTiming: '',
    eventInterests: [],
    additionalRequests: ''
  });

  const images = [
    '/images/Why Sponsor us/1.webp',
    '/images/Why Sponsor us/2.webp',
    '/images/Why Sponsor us/3.webp',
    '/images/Why Sponsor us/4.webp',
    '/images/Why Sponsor us/5.webp',
    '/images/Why Sponsor us/6.webp',
    '/images/Why Sponsor us/7.webp',
    '/images/Why Sponsor us/8.webp',
    '/images/Why Sponsor us/9.webp',
    '/images/Why Sponsor us/10.webp',
    '/images/Why Sponsor us/11.webp'
  ];

  const eventOptions = [
    'Opening Ceremony',
    'Cultural Events',
    'Technical Workshops',
    'Sports Events',
    'Food Festival',
    'Closing Ceremony',
    'Overall Event'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (event: string) => {
    setFormData(prev => ({
      ...prev,
      eventInterests: prev.eventInterests.includes(event)
        ? prev.eventInterests.filter(e => e !== event)
        : [...prev.eventInterests, event]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/mzzazdjp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          eventInterests: formData.eventInterests.join(', ')
        }),
      });

      if (response.ok) {
        setSubmitMessage('Thank you! We\'ll get back to you soon.');
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          sponsorshipAmount: '',
          preferredTiming: '',
          eventInterests: [],
          additionalRequests: ''
        });
        setTimeout(() => {
          setIsFormOpen(false);
          setSubmitMessage('');
        }, 2000);
      } else {
        setSubmitMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Network error. Please check your connection.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Images Container */}
      {images.map((image, index) => (
        <div key={index} className="w-full">
          <img 
            src={image} 
            alt={`Sponsorship slide ${index + 1}`}
            className="w-full h-auto object-contain"
          />
        </div>
      ))}

      {/* Floating Contact Button */}
      <motion.button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-4 rounded-full shadow-2xl z-40 flex items-center gap-3 font-semibold transition-all duration-300 transform hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      >
        <Mail className="w-5 h-5" />
        <span className="hidden sm:inline">Become a Sponsor</span>
        <span className="sm:hidden">Sponsor</span>
      </motion.button>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFormOpen(false)}
          >
            <motion.div
              className="bg-black/60 backdrop-blur-md text-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Sponsorship Inquiry</h2>
                    <p className="text-purple-100">Let's discuss partnership opportunities</p>
                  </div>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Company Name - Required */}
                <div>
                  <label className="flex items-center gap-2 text-white/85 font-medium mb-2">
                    <Building className="w-4 h-4" />
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-300"
                    placeholder="Enter your company name"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label className="flex items-center gap-2 text-white/85 font-medium mb-2">
                    <MessageCircle className="w-4 h-4" />
                    Contact Person
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-300"
                    placeholder="Your name"
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-white/85 font-medium mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-300"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-white/85 font-medium mb-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder-gray-300"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* Sponsorship Amount */}
                <div>
                  <label className="flex items-center gap-2 text-white/85 font-medium mb-2">
                    <span className="text-lg font-bold">₹</span>
                    Willing to Sponsor Amount
                  </label>
                  <select
                    name="sponsorshipAmount"
                    value={formData.sponsorshipAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white appearance-none"
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }}
                  >
                    <option value="">Select range</option>
                    <option value="₹10,000 - ₹25,000">₹10,000 - ₹25,000</option>
                    <option value="₹25,000 - ₹50,000">₹25,000 - ₹50,000</option>
                    <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                    <option value="₹1,00,000 - ₹2,00,000">₹1,00,000 - ₹2,00,000</option>
                    <option value="₹2,00,000+">₹2,00,000+</option>
                    <option value="Open to discussion">Open to discussion</option>
                  </select>
                </div>

                {/* Preferred Timing */}
                <div>
                  <label className="flex items-center gap-2 text-white/85 font-medium mb-2">
                    <Clock className="w-4 h-4" />
                    Preferred Time for Call
                  </label>
                  <select
                    name="preferredTiming"
                    value={formData.preferredTiming}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white appearance-none"
                    style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }}
                  >
                    <option value="">Select preferred time</option>
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>

                {/* Event Interests */}
                <div>
                  <label className="text-white/85 font-medium mb-3 block">
                    Events of Interest (Optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {eventOptions.map((event) => (
                      <label key={event} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.eventInterests.includes(event)}
                          onChange={() => handleCheckboxChange(event)}
                          className="w-4 h-4 text-purple-400 bg-black/0 border-white/30 rounded focus:ring-purple-500"
                        />
                        <span className="text-sm text-white">{event}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Requests */}
                <div>
                  <label className="text-white/85 font-medium mb-2 block">
                    Additional Requests or Comments
                  </label>
                  <textarea
                    name="additionalRequests"
                    value={formData.additionalRequests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-white placeholder-gray-300"
                    placeholder="Any specific requirements, branding needs, or questions..."
                  />
                </div>

                {/* Submit Message */}
                {submitMessage && (
                  <div className={`p-4 rounded-lg text-center font-medium ${
                    submitMessage.includes('Thank you') 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-red-100 text-red-700 border border-red-300'
                  }`}>
                    {submitMessage}
                  </div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || !formData.companyName}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:cursor-not-allowed"
                  whileHover={{ scale: formData.companyName ? 1.02 : 1 }}
                  whileTap={{ scale: formData.companyName ? 0.98 : 1 }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Inquiry
                    </>
                  )}
                </motion.button>

                <p className="text-sm text-gray-300 text-center">
                  We'll get back to you within 24 hours to discuss partnership opportunities.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhySponsorUs;