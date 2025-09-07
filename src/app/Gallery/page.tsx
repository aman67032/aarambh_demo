"use client";
import React, { useState, useEffect } from 'react';
import { IconChevronLeft, IconChevronRight, IconMenu2, IconChevronUp, IconHome, IconInfoCircle, IconCalendar, IconUsers, IconStar, IconHelpCircle, IconMail, IconClock } from '@tabler/icons-react';
import { Handshake } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import InfinityTransition from '../../../components/InfinityTransition';
import Logo from '../../../components/Logo';

const Gallery = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [targetHref, setTargetHref] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [stars, setStars] = useState<Array<{id: number, x: number, y: number, size: number, animationDelay: number, duration: number}>>([]);
  
  const router = useRouter();
  
  // Responsive image sets for desktop and mobile
  const desktopImages = [
    '/images/gallery_desktop/1.webp',
    '/images/gallery_desktop/2.webp',
    '/images/gallery_desktop/3.webp',
    '/images/gallery_desktop/4.webp',
    '/images/gallery_desktop/5.webp',
    '/images/gallery_desktop/6.webp',
  ];

  const mobileImages = [
    '/images/gallery_mobile/7.webp',
    '/images/gallery_mobile/8.webp',
    '/images/gallery_mobile/9.webp',
    '/images/gallery_mobile/10.webp',
    '/images/gallery_mobile/11.webp',
    '/images/gallery_mobile/12.webp',
  ];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile('matches' in e ? e.matches : (e as MediaQueryList).matches);
    };
    // Set initial
    handleChange(mql);
    // Listen to changes
    mql.addEventListener ? mql.addEventListener('change', handleChange as (e: MediaQueryListEvent) => void) : mql.addListener(handleChange as any);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', handleChange as (e: MediaQueryListEvent) => void) : mql.removeListener(handleChange as any);
    };
  }, []);

  const images = isMobile ? mobileImages : desktopImages;

  // Navigation items for mobile menu - matching HOME page style
  const navigationItems = [
    { href: '/', label: 'Home', icon: <IconHome className="w-5 h-5" /> },
    { href: '/About', label: 'About', icon: <IconInfoCircle className="w-5 h-5" /> },
    { href: '/Events', label: 'Events', icon: <IconCalendar className="w-5 h-5" /> },
    { href: '/Gallery', label: 'Highlights', icon: <IconStar className="w-5 h-5" /> },
    { href: '/schedule/progress', label: 'Schedule', icon: <IconClock className="w-5 h-5" /> },
    { href: '/Team', label: 'Team', icon: <IconUsers className="w-5 h-5" /> },
    { href: '/FAQ', label: 'FAQ', icon: <IconHelpCircle className="w-5 h-5" /> },
    { href: '/why-sponsor-us', label: 'Why Sponsor Us', icon: <Handshake className="w-5 h-5" /> },
    { href: '/Contact', label: 'Contact', icon: <IconMail className="w-5 h-5" /> },
  ];

  // Handle mobile navigation
  const handleMobileNavigation = (href: string) => {
    setTargetHref(href);
    setShowTransition(true);
    setMobileMenuOpen(false);
  };

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll as any);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate stars for the background - optimized for mobile
  useEffect(() => {
    const generateStars = () => {
      const starCount = isMobile ? 50 : 100; // Fewer stars on mobile for performance
      const newStars = Array.from({ length: starCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        animationDelay: Math.random() * 3,
        duration: Math.random() * 4 + 2
      }));
      setStars(newStars);
    };
    generateStars();
  }, [isMobile]);

  // Auto-advance slides every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.hidden) return;
      if (!isTransitioning) {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [images.length, isTransitioning]);

  const handleImageChange = (newIndex: number) => {
    if (newIndex !== currentImageIndex && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentImageIndex(newIndex);
      
      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1000);
    }
  };

  const goToNext = () => {
    const nextIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    handleImageChange(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    handleImageChange(prevIndex);
  };

  const goToImage = (index: number) => {
    handleImageChange(index);
  };

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden">
      {/* Logo and sidebar */}
      <Logo className="block" />

      {/* Infinity Transition */}
      <InfinityTransition 
        isActive={showTransition} 
        targetHref={targetHref}
        onComplete={() => {
          setShowTransition(false);
          setTargetHref('');
        }}
      />

      {/* Mobile hamburger - matching HOME page style */}
      <button
        aria-label="Open menu"
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl active:scale-95 transition pointer-events-auto"
      >
        <span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
        <span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
        <span className="block h-0.5 bg-white/80 rounded-full w-4" />
      </button>

      {/* Mobile menu overlay - matching HOME page style */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
          <div className="absolute top-4 right-4">
            <button
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
            >
              <IconMenu2 className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="pt-20 px-6 h-full overflow-y-auto">
            <div className="grid grid-cols-1 gap-3 pb-8">
              {navigationItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleMobileNavigation(item.href)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 text-white text-base hover:bg-white/15 active:scale-[0.99] transition text-left"
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/20">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Starry Space Background - enhanced layering */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0b1a] via-[#140a2a] via-[#240a33] to-black -z-10">
        {/* Hero background image (responsive) */}
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/herobg.webp" />
          <img
            loading="lazy" decoding="async"
            src="/images/hero.webp"
            alt="Hero background"
            className="absolute inset-0 w-full h-full object-cover opacity-15"
          />
        </picture>

        {/* Soft aurora overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen">
          <div className="absolute -top-20 -left-10 w-[55vw] h-[55vw] bg-gradient-to-tr from-cyan-500/30 via-fuchsia-500/25 to-transparent blur-3xl animate-pulse" style={{animationDuration:'9s'}} />
          <div className="absolute bottom-0 right-0 w-[45vw] h-[45vw] bg-gradient-to-tl from-purple-500/25 via-blue-500/20 to-transparent blur-3xl animate-pulse" style={{animationDuration:'11s', animationDelay:'1.5s'}} />
        </div>

        {/* Vignette for better focus */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.65)_100%)]" />
        
        {/* Animated Stars - reduced count on mobile */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.animationDelay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
        
        {/* Nebula Effects - simplified for mobile */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-400 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      {/* Page Title - mobile optimized */}
      <div className="text-center pt-16 pb-8 z-20 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-3 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.35)]">
          Last Sabrang
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 drop-shadow-[0_0_12px_rgba(34,211,238,0.25)] px-2">
          Relive the moments from Sabrang '25!
        </p>
        <div className="mt-4 h-1 w-32 sm:w-48 mx-auto rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 blur-[1px]"></div>
      </div>
      
      {/* Main Image Display - mobile optimized */}
      <div className="relative w-full flex items-center justify-center p-0 lg:p-0 z-10 h-[calc(100vh-200px)] sm:h-[calc(100vh-180px)]">
        <div className="relative w-full max-w-7xl h-full">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentImageIndex 
                  ? 'opacity-100 scale-100 blur-0' 
                  : 'opacity-0 scale-110 blur-sm'
              }`}
              style={{
                transform: index === currentImageIndex 
                  ? 'scale(1) rotate(0deg)' 
                  : 'scale(1.1) rotate(1deg)',
                filter: index === currentImageIndex 
                  ? 'brightness(1) contrast(1)' 
                  : 'brightness(0.8) contrast(0.8)',
              }}
            >
              <img
                loading="lazy" decoding="async" fetchPriority="low" draggable={false}
                sizes="100vw"
                src={image}
                alt={`Gallery Image ${index + 1}`}
                className="w-full h-full object-contain transition-all duration-1000 ease-in-out"
                style={{
                  transform: index === currentImageIndex 
                    ? 'scale(1.12)' 
                    : 'scale(1.15)',
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons - mobile optimized positioning */}
        {/* Left Navigation Button (Previous) */}
        <div className="absolute left-2 sm:left-4 lg:left-auto lg:right-28 top-1/2 transform -translate-y-1/2 z-20">
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className={`relative group overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 p-1 rounded-full shadow-2xl transition-all duration-500 transform ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-purple-500/50 hover:scale-110 hover:rotate-3 active:scale-95'
            }`}
            aria-label="Previous image"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative bg-black/80 backdrop-blur-md p-2 lg:p-3 rounded-full border border-purple-400/30 hover:border-purple-300/60 transition-all duration-300">
              <IconChevronLeft className="w-4 h-4 lg:w-6 lg:h-6 text-white group-hover:text-purple-200 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500 -z-10"></div>
          </button>
        </div>

        {/* Right Navigation Button (Next) */}
        <div className="absolute right-2 sm:right-4 lg:right-8 top-1/2 transform -translate-y-1/2 z-20">
          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className={`relative group overflow-hidden bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 p-1 rounded-full shadow-2xl transition-all duration-500 transform ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-cyan-500/50 hover:scale-110 hover:-rotate-3 active:scale-95'
            }`}
            aria-label="Next image"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative bg-black/80 backdrop-blur-md p-2 lg:p-3 rounded-full border border-cyan-400/30 hover:border-cyan-300/60 transition-all duration-300">
              <IconChevronRight className="w-4 h-4 lg:w-6 lg:h-6 text-white group-hover:text-cyan-200 transition-all duration-300 group-hover:scale-125 group-hover:-rotate-12" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity duration-500 -z-10"></div>
          </button>
        </div>

        {/* Mobile Image Counter - enhanced styling */}
        <div className="lg:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
          <span className="text-white text-sm font-medium">
            {currentImageIndex + 1} / {images.length}
          </span>
        </div>

        {/* Mobile Thumbnail Dots */}
        <div className="lg:hidden absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll to Top Button - mobile optimized */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <IconChevronUp className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;