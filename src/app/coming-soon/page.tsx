"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function ComingSoon() {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  const text = "Registration Start Soon";
  const [progress, setProgress] = useState(0);

  // Generate consistent random values for floating orbs
  const floatingOrbs = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      width: 100 + (i * 23.5) % 200,
      height: 100 + (i * 31.2) % 200,
      left: (i * 12.5) % 100,
      top: (i * 18.7) % 100,
      color1: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#a29bfe', '#fd79a8', '#fdcb6e'][i],
      color2: ['#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#a29bfe', '#fd79a8', '#fdcb6e', '#ff6b6b'][i],
      delay: i * 0.5,
      duration: 10 + (i * 0.7)
    }));
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  // Cursor blink effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 50) return 50;
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(45deg, #0f0f23, #1a1a2e, #16213e, #0f3460, #533483)",
          backgroundSize: "400% 400%",
          animation: "gradientShift 8s ease infinite"
        }}
      />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 30% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)"
        }}
      />

      {/* Floating gradient orbs */}
      <div className="absolute inset-0">
        {floatingOrbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full blur-xl"
            style={{
              width: `${orb.width}px`,
              height: `${orb.height}px`,
              left: `${orb.left}%`,
              top: `${orb.top}%`,
              background: `linear-gradient(45deg, ${orb.color1}, ${orb.color2})`,
              opacity: 0.1
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              delay: orb.delay,
            }}
          />
        ))}
      </div>

      {/* Top right icon with gradient */}
      <div className="absolute top-8 right-8">
        <div className="relative">
          <div 
            className="absolute inset-0 rounded-full blur-sm"
            style={{
              background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)"
            }}
          />
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="url(#iconGradient)" 
            strokeWidth="2"
            className="relative z-10"
          >
            <defs>
              <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b6b" />
                <stop offset="50%" stopColor="#4ecdc4" />
                <stop offset="100%" stopColor="#45b7d1" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="text-center relative z-10">
        {/* Main title with enhanced gradient */}
        <div className="mb-8">
          <div 
            className="text-6xl md:text-8xl font-light tracking-wide"
            style={{
              background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #a29bfe, #fd79a8)",
              backgroundSize: "300% 300%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "textShimmer 3s ease-in-out infinite"
            }}
          >
            {displayText}
            <motion.span
              animate={{ opacity: showCursor ? 1 : 0 }}
              className="inline-block w-2 h-16 ml-2"
              style={{
                background: "linear-gradient(to bottom, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)"
              }}
            />
          </div>
        </div>
      </div>

      {/* Gradient progress bar */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-80">
        <div className="flex justify-between text-sm mb-2">
          <span style={{ background: "linear-gradient(45deg, #ff6b6b, #4ecdc4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Progress</span>
          <span style={{ background: "linear-gradient(45deg, #45b7d1, #96ceb4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{progress}%</span>
        </div>
        <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-full h-3 p-0.5">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #ffeaa7, #a29bfe, #fd79a8)",
              backgroundSize: "200% 200%",
              animation: "gradientMove 3s ease infinite"
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
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