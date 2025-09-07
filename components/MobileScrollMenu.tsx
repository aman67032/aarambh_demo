'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Users, 
  Handshake, 
  Info, 
  Clock, 
  Star, 
  Mail,
  Home,
  HelpCircle,
  X
} from 'lucide-react';

interface MobileScrollMenuProps {
  onNavigate: (href: string) => void;
}

const navigationItems = [
  { title: 'Home', icon: <Home className="w-5 h-5" />, href: '/' },
  { title: 'About', icon: <Info className="w-5 h-5" />, href: '/About' },
  { title: 'Events', icon: <Calendar className="w-5 h-5" />, href: '/Events' },
  { title: 'Highlights', icon: <Star className="w-5 h-5" />, href: '/Gallery' },
  { title: 'Schedule', icon: <Clock className="w-5 h-5" />, href: '/schedule/progress' },
  { title: 'Team', icon: <Users className="w-5 h-5" />, href: '/Team' },
  { title: 'FAQ', icon: <HelpCircle className="w-5 h-5" />, href: '/FAQ' },
  { title: 'Why Sponsor Us', icon: <Handshake className="w-5 h-5" />, href: '/why-sponsor-us' },
  { title: 'Contact', icon: <Mail className="w-5 h-5" />, href: '/Contact' },
];

const MobileScrollMenu: React.FC<MobileScrollMenuProps> = ({ onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const lastScrollYRef = useRef(0);
  const scrollThreshold = 150; // Show menu after scrolling 150px
  const router = useRouter();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const lastScrollY = lastScrollYRef.current;
        setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');

        if (currentScrollY > scrollThreshold && currentScrollY > lastScrollY) {
          setIsVisible(true);
        } else if (currentScrollY < scrollThreshold || currentScrollY <= lastScrollY) {
          setIsVisible(false);
          setIsExpanded(false);
        }

        lastScrollYRef.current = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsExpanded((v) => !v);
  }, []);

  const handleNavigation = useCallback((href: string) => {
    setIsExpanded(false);
    onNavigate(href);
  }, [onNavigate]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-50 lg:hidden"
        >
          {/* Background blur with gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40 backdrop-blur-md" />
          
          {/* Subtle border glow */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          {/* Menu container */}
          <div className="relative px-4 py-3">
            {/* Header with logo and toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <a href="/" aria-label="Go to homepage">
                  <img
                    src="/images/Logo@2x.png"
                    alt="Logo"
                    className="h-8 w-auto cursor-pointer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/Logo.svg';
                    }}
                  />
                </a>
                <span className="text-white font-semibold text-sm">Sabrang 25</span>
              </div>
              
              <button
                onClick={handleMenuToggle}
                className="p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-200 group relative overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                
                <div className="relative z-10">
                  {isExpanded ? (
                    <X className="w-5 h-5 text-white" />
                  ) : (
                    <div className="space-y-1">
                      <span className="block h-0.5 bg-white rounded-full w-5 transition-all duration-200" />
                      <span className="block h-0.5 bg-white/90 rounded-full w-4 transition-all duration-200" />
                      <span className="block h-0.5 bg-white/80 rounded-full w-3 transition-all duration-200" />
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Expanded menu */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pb-2">
                    <div className="grid grid-cols-1 gap-2">
                      {navigationItems.map((item, index) => (
                        <motion.button
                          key={item.title}
                          onClick={() => handleNavigation(item.href)}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm hover:bg-white/15 active:scale-[0.98] transition-all duration-200 text-left group relative overflow-hidden"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Hover glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                          
                          <div className="flex-shrink-0 w-8 h-8 bg-white/15 rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-200 relative z-10">
                            {item.icon}
                          </div>
                          <span className="font-medium relative z-10">{item.title}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileScrollMenu;
