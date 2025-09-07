"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronUp } from '@tabler/icons-react';
import { Calendar, Users, Handshake, Info, Clock, Star, Mail, Home, HelpCircle, X } from 'lucide-react';
import ChromaGrid from "./ChromaGrid";
import Logo from "../../../components/Logo";
import { useNavigation } from '../../../components/NavigationContext';

const TeamPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const { navigate } = useNavigation();

  // Navigation items for mobile menu (same as About page)
  const mobileNavItems: { title: string; href: string; icon: React.ReactNode }[] = [
    { title: 'Home', href: '/?skipLoading=true', icon: <Home className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
    { title: 'Schedule', href: '/schedule/progress', icon: <Clock className="w-5 h-5" /> },
    { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
    { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
    { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
    { title: 'Contact', href: '/Contact', icon: <Mail className="w-5 h-5" /> },
  ];



  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen text-white relative">

      {/* Mobile top-left logo (same as About page) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <a href="/" aria-label="Go to homepage">
          <img
            src="/images/Logo@2x.png"
            alt="Logo"
            className="h-10 w-auto cursor-pointer"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/Logo.svg'; }}
          />
        </a>
      </div>

      {/* Mobile hamburger (same style as About page) */}
      <button
        aria-label="Open menu"
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl active:scale-95 transition"
      >
        <span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
        <span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
        <span className="block h-0.5 bg-white/80 rounded-full w-4" />
      </button>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
          <div className="absolute top-4 right-4">
            <button
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="pt-20 px-6">
            <div className="grid grid-cols-1 gap-3">
              {mobileNavItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => { setMobileMenuOpen(false); navigate(item.href); }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 text-white text-base hover:bg-white/15 active:scale-[0.99] transition text-left"
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/20">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Background Image */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/backgrounds/teampage.webp)'
        }}
      />

      {/* Glassy Translucent Overlay with 0.4 opacity */}
      <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-sm" />

      {/* Desktop Logo and Sidebar */}
      <div className="hidden lg:block">
        <Logo />
      </div>

      {/* Main Content Container - flex-1 makes it take remaining space */}
      <div className="relative z-10 pt-24 lg:pt-24 flex-1">
        <div className="px-4 sm:px-6 py-8 sm:py-16">
          {/* Enhanced page header */}
          <div className="text-center mb-8 sm:mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4"
            >
              Our Team
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Meet the passionate individuals who make SABRANG'25 possible. From visionary leaders to dedicated team members, 
              each person contributes their unique talents to create an unforgettable experience.
            </motion.p>
          </div>
          
          {/* Decorative elements */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full" />
          </motion.div>
          
          <ChromaGrid />
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <IconChevronUp className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPage;
