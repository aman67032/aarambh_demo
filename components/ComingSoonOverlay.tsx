'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SidebarDock from './SidebarDock';
import Logo from './Logo';

const phases = [
  'Something extraordinary is being prepared...',
  'Curating a memorable cultural journey...',
  'Building an immersive experience...',
  'Final touches in progress...',
  'Get ready for the reveal...',
];

export default function ComingSoonOverlay() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Set client flag after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Phase cycling
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      // Trigger glitch effect on text change
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 200);
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [isClient]);

  // Progress animation
  useEffect(() => {
    if (!isClient) return;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 2;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isClient]);

  // Canvas particle animation
  useEffect(() => {
    if (!canvasRef.current || !isClient) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
      life: number;
      type: 'star' | 'glow' | 'sparkle';
    }> = [];

    // Initialize particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 4 + 1,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        opacity: Math.random() * 0.6 + 0.2,
        life: Math.random() * 300 + 150,
        type: Math.random() > 0.7 ? 'star' : Math.random() > 0.5 ? 'glow' : 'sparkle'
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Reset particle when life expires
        if (particle.life <= 0) {
          particles[index] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 4 + 1,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            opacity: Math.random() * 0.6 + 0.2,
            life: Math.random() * 300 + 150,
            type: Math.random() > 0.7 ? 'star' : Math.random() > 0.5 ? 'glow' : 'sparkle'
          };
        }

        // Draw particle based on type
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        if (particle.type === 'star') {
          // Draw star shape
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
            const x = particle.x + Math.cos(angle) * particle.size;
            const y = particle.y + Math.sin(angle) * particle.size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        } else if (particle.type === 'glow') {
          // Draw glowing circle
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          gradient.addColorStop(0, particle.color);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw sparkle
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Canvas Background - Only render on client */}
      {isClient && <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.6 }} />}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/10 via-transparent to-cyan-900/10" />

      {/* Sidebar and Logo */}
      <Logo className="block" />
      <SidebarDock className="hidden lg:block" />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 py-12">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/5 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/3 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white/2 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight"
            animate={{
              textShadow: [
                '0 0 30px rgba(255, 105, 180, 0.3)',
                '0 0 60px rgba(255, 105, 180, 0.6)',
                '0 0 30px rgba(255, 105, 180, 0.3)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-white">SABRANG</span>
          </motion.h1>
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            2025
          </motion.h2>
          <motion.p className="text-lg md:text-xl text-gray-400 font-light tracking-widest uppercase">
            Cultural Extravaganza
          </motion.p>
        </motion.div>

        {/* Text Reveal - Only show after client loads */}
        {isClient ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
            className="mb-12 h-24 md:h-32 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              <motion.h2 
                key={currentPhase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={`text-2xl md:text-4xl lg:text-5xl font-bold font-mono ${
                  showGlitch ? 'animate-pulse' : ''
                }`}
                style={{
                  textShadow: showGlitch 
                    ? '2px 0 0 rgba(255, 0, 0, 0.5), -2px 0 0 rgba(0, 255, 255, 0.5)'
                    : '0 0 20px rgba(255, 105, 180, 0.3)'
                }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
                  {phases[currentPhase]}
                </span>
              </motion.h2>
            </AnimatePresence>
          </motion.div>
        ) : (
          // Loading placeholder to prevent layout shift
          <div className="mb-12 h-24 md:h-32 flex items-center justify-center">
            <div className="text-2xl md:text-4xl lg:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
              Loading...
            </div>
          </div>
        )}

        {/* Progress Section - Only show after client loads */}
        {isClient ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
            className="mb-12"
          >
            <motion.p className="text-white/70 font-medium text-lg mb-4">
              Preparing Experience
            </motion.p>
            
            {/* Progress Bar */}
            <motion.div className="w-80 md:w-96 h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full relative"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 2, ease: 'easeOut' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </motion.div>
            </motion.div>
            
            <motion.p className="text-white/50 text-sm mt-2">
              {Math.round(progress)}% Complete
            </motion.p>
          </motion.div>
        ) : (
          // Loading placeholder to prevent layout shift
          <div className="mb-12">
            <div className="text-white/70 font-medium text-lg mb-4">
              Preparing Experience
            </div>
            <div className="w-80 md:w-96 h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
              <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>
            <div className="text-white/50 text-sm mt-2">
              Loading...
            </div>
          </div>
        )}

        {/* Fun Elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.5, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-3">
            <motion.div
              className="w-3 h-3 bg-pink-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="w-3 h-3 bg-purple-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
            <motion.div
              className="w-3 h-3 bg-cyan-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            />
          </div>
        </motion.div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 2, ease: 'easeOut' }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center"
        >
          <motion.p
            className="text-white/60 font-light text-base md:text-lg mb-4"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            Setting up something magical. Stay connected for updates
          </motion.p>
          
          <motion.div
            className="flex items-center justify-center space-x-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}