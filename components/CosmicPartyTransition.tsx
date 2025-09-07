'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CosmicPartyTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
}

const CosmicPartyTransition: React.FC<CosmicPartyTransitionProps> = ({ 
  isActive, 
  onComplete 
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      // Generate random particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 2,
        color: ['#40ffaa', '#ff7ad9', '#ffd35a', '#4079ff', '#f6e05e'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      // Auto-complete after animation duration
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[100] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Cosmic background overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/30 to-pink-900/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Aurora effects */}
          <motion.div
            className="aurora-blob aurora-1"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          />
          <motion.div
            className="aurora-blob aurora-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <motion.div
            className="aurora-blob aurora-3"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          />

          {/* Floating particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              }}
              initial={{ 
                opacity: 0, 
                scale: 0, 
                y: 0,
                rotate: 0 
              }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [-20, -100, -200],
                rotate: [0, 360],
              }}
              exit={{ 
                opacity: 0, 
                scale: 0,
                y: -200 
              }}
              transition={{ 
                duration: 2,
                delay: particle.delay,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Confetti pieces */}
          {Array.from({ length: 30 }, (_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute w-2 h-2"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#40ffaa', '#ff7ad9', '#ffd35a', '#4079ff', '#f6e05e'][Math.floor(Math.random() * 5)],
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
              initial={{ 
                opacity: 0, 
                y: 0,
                rotate: 0 
              }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [0, -150, -300],
                rotate: [0, 720],
              }}
              exit={{ 
                opacity: 0, 
                y: -300 
              }}
              transition={{ 
                duration: 1.5,
                delay: Math.random() * 0.8,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Central burst effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 opacity-30 blur-xl" />
          </motion.div>

          {/* Celebration text */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.8] }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-white title-chroma mb-2">
              SABRANG
            </h2>
            <p className="text-lg text-yellow-300 font-medium">
              Let's Party! 🎉
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CosmicPartyTransition;


