'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
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
  LayoutDashboard
} from 'lucide-react';

interface SidebarDockProps {
  className?: string;
  onNavigate?: (href: string) => void;
}

const navigationItems = [
  { title: 'Home', icon: <Home className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5" />, href: '/' },
  { title: 'About', icon: <Info className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5" />, href: '/About' },
  { title: 'Events', icon: <Calendar className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5" />, href: '/Events' },
  { title: 'Highlights', icon: <Star className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5" />, href: '/Gallery' },
  { title: 'Schedule', icon: <Clock className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5" />, href: '/schedule/progress' },
  { title: 'Team', icon: <Users className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5" />, href: '/Team' },
  { title: 'FAQ', icon: <HelpCircle className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5" />, href: '/FAQ' },
  { title: 'Why Sponsor Us', icon: <Handshake className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5" />, href: '/why-sponsor-us' },
  { title: 'Contact', icon: <Mail className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5" />, href: '/Contact' },
];

export const SidebarDock: React.FC<SidebarDockProps> = ({ className = '', onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const router = useRouter();
  const mouseY = useMotionValue(Infinity);

  // Track screen size changes
  useEffect(() => {
    const updateScreenSize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  const handleMouseEnter = useCallback(() => setIsExpanded(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsExpanded(false);
    mouseY.set(Infinity);
  }, [mouseY]);
  const handleMouseMove = useCallback((e: React.MouseEvent) => mouseY.set(e.clientY), [mouseY]);

  return (
    <motion.div
      className={`fixed left-2 sm:left-3 md:left-4 lg:left-6 xl:left-8 top-[55%] transform -translate-y-1/2 z-[90] transform-gpu ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      initial={false}
    >
      <motion.div
        className="flex flex-col items-start gap-2 sm:gap-2.5 md:gap-3 rounded-xl sm:rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 px-2 py-3 sm:px-2.5 sm:py-3.5 md:px-3 md:py-4 lg:px-4 lg:py-5 shadow-2xl"
        animate={{
          width: isExpanded ? 'auto' : 'auto',
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        style={{
          width: isExpanded ? 
            (screenSize.width < 640 ? 160 : 
             screenSize.width < 768 ? 180 : 
             screenSize.width < 1024 ? 200 : 
             screenSize.width < 1280 ? 220 : 240) : 
            (screenSize.width < 640 ? 48 : 
             screenSize.width < 768 ? 52 : 
             screenSize.width < 1024 ? 56 : 
             screenSize.width < 1280 ? 60 : 64)
        }}
      >
        {navigationItems.map((item, index) => (
          <IconContainer 
            key={item.title} 
            item={item} 
            index={index} 
            mouseY={mouseY}
            isExpanded={isExpanded}
            onNavigate={onNavigate}
            router={router}
            screenSize={screenSize}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

function IconContainer({ 
  item, 
  index, 
  mouseY, 
  isExpanded,
  router,
  onNavigate,
  screenSize
}: {
  item: { title: string; icon: React.ReactNode; href: string };
  index: number;
  mouseY: MotionValue<number>;
  isExpanded: boolean;
  router: ReturnType<typeof useRouter>;
  onNavigate?: (href: string) => void;
  screenSize: { width: number; height: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ y: 0, height: 0 });

  const distance = useTransform(mouseY, (val: number) => {
    return val - bounds.y - bounds.height / 2;
  });

  // The use of `useTransform` here creates a "magnetic" or "fisheye" effect on the icons.
  // Scale based on screen size
  const baseSize = screenSize.width < 640 ? 32 : 
                   screenSize.width < 768 ? 36 : 
                   screenSize.width < 1024 ? 40 : 
                   screenSize.width < 1280 ? 44 : 48;
  
  const expandedSize = screenSize.width < 640 ? 56 : 
                       screenSize.width < 768 ? 64 : 
                       screenSize.width < 1024 ? 72 : 
                       screenSize.width < 1280 ? 80 : 88;
  
  const widthTransform = useTransform(distance, [-150, 0, 150], [baseSize, expandedSize, baseSize]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [baseSize, expandedSize, baseSize]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  // Derive icon size from the container's animated size for better performance.
  const widthIcon = useTransform(width, (w) => w * 0.5);
  const heightIcon = useTransform(height, (h) => h * 0.5);

  useEffect(() => {
    if (ref.current) {
      setBounds(ref.current.getBoundingClientRect());
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  const handleClick = useCallback(() => {
    if (onNavigate) {
      onNavigate(item.href);
    } else {
      // Fallback to direct navigation if no handler is provided.
      router.push(item.href);
    }
  }, [item.href, router, onNavigate]);
  return (
    <motion.button
      onClick={handleClick}
      aria-label={item.title}
      className="group flex items-center gap-3 w-full text-white hover:text-white/80 transition-colors transform-gpu"
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        transition: { delay: index * 0.05 }
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        className="flex-shrink-0 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors transform-gpu"
      >
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-white"
        >
          {item.icon}
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs sm:text-sm md:text-sm lg:text-base font-medium whitespace-nowrap overflow-hidden"
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default SidebarDock;
