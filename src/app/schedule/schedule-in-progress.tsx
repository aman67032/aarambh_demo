"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Star, Menu, X, Info, HelpCircle, Mail, Handshake, Home } from "lucide-react";
import { useNavigation } from '../../../components/NavigationContext';

export default function ScheduleInProgress() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { navigate } = useNavigation();

  // Update time
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 75) return 75;
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Generate consistent floating elements
  const floatingElements = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: (i * 16.7) % 100,
      top: (i * 14.3) % 100,
      delay: i * 0.3,
      size: 80 + (i * 20)
    }));
  }, []);

  const scheduleFeatures = [
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Event Planning",
      description: "Crafting the perfect timeline for Sabrang 25",
      progress: 85
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Time Management",
      description: "Optimizing schedules for maximum engagement",
      progress: 70
    }
  ];

  const navigationItems = [
    { title: 'Home', href: '/', icon: <Calendar className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
    { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
    { title: 'FAQ', href: '/FAQ', icon: <Clock className="w-5 h-5" /> },
    { title: 'Contact', href: '/Contact', icon: <Calendar className="w-5 h-5" /> },
  ];
  const mobileNavItems: { title: string; href: string; icon: React.ReactNode }[] = [
    { title: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
    { title: 'Schedule', href: '/schedule/progress', icon: <Clock className="w-5 h-5" /> },
    { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
    { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
    { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
    { title: 'Contact', href: '/Contact', icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(45deg,rgb(2, 2, 4),rgb(1, 1, 2),rgb(0, 0, 0),rgb(0, 0, 0),rgb(0, 0, 0))",
          backgroundSize: "400% 400%",
          animation: "gradientShift 12s ease infinite"
        }}
      />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 20% 30%, rgba(120, 119, 198, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 119, 198, 0.2) 0%, transparent 50%)"
        }}
      />

      {/* Floating elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full blur-2xl"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${element.left}%`,
              top: `${element.top}%`,
              background: `linear-gradient(45deg, ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#a29bfe'][element.id]}, ${['#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#a29bfe', '#ff6b6b'][element.id]})`,
              opacity: 0.08
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + element.id * 0.5,
              repeat: Infinity,
              delay: element.delay,
            }}
          />
        ))}
      </div>

      {/* Mobile hamburger */}
      <button
        aria-label="Open menu"
        onClick={() => setIsMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl active:scale-95 transition"
      >
        <span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
        <span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
        <span className="block h-0.5 bg-white/80 rounded-full w-4" />
      </button>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
          <div className="absolute top-4 right-4">
            <button
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
              className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="pt-20 px-6 h-full overflow-y-auto">
            <div className="grid grid-cols-1 gap-3 pb-8">
              {mobileNavItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => { setIsMenuOpen(false); navigate(item.href); }}
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

      {/* Top right time display */}
      {mounted && (
        <div className="absolute top-8 left-6 z-10 hidden md:block">
          <div className="text-white/60 text-sm font-mono bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="text-center relative z-10 px-6 max-w-4xl mx-auto" style={{ paddingTop: '50px' }}>
        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div 
            className="text-5xl md:text-7xl font-bold tracking-wide mb-4"
            style={{
              background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #a29bfe)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "textShimmer 4s ease-in-out infinite"
            }}
          >
            Schedule in Progress
          </div>
          
          <p className="text-xl md:text-2xl text-white/80 font-light max-w-2xl mx-auto">
            We're crafting the perfect timeline for Sabrang 25. Stay tuned for an unforgettable experience!
          </p>
        </motion.div>

        {/* Overall progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex justify-between text-sm text-white/80 mb-3">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-full h-4 p-1">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #a29bfe)",
                backgroundSize: "200% 200%",
                animation: "gradientMove 3s ease infinite"
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Schedule features grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          {scheduleFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
              className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                  {feature.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{feature.description}</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${feature.progress}%` }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 1 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Final message */}
       {/* Final message */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 1.2, duration: 0.8 }}
  className="text-center"
>
  <p className="text-white/60 text-lg">
    The schedule will be revealed soon with all the exciting events and activities!
  </p>
</motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes textShimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
