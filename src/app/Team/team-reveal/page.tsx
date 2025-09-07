'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function TeamRevealPage() {
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const fullText = 'Our Amazing Team Will Be Revealed Soon!';

  useEffect(() => {
    if (textIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setCurrentText(fullText.slice(0, textIndex + 1));
        setTextIndex(textIndex + 1);
      }, 70);
      return () => clearTimeout(timeout);
    }
  }, [textIndex, fullText]);

  useEffect(() => {
    if (textIndex === fullText.length) {
      const timeout = setTimeout(() => {
        setTextIndex(0);
        setCurrentText('');
      }, 2400);
      return () => clearTimeout(timeout);
    }
  }, [textIndex]);

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#0B1023] via-[#0A0F1F] to-[#0F1229]">
      {/* Aurora/Glow background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-purple-600/25 blur-3xl" />
        <div className="absolute -bottom-32 -right-40 h-[28rem] w-[28rem] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-64 w-[44rem] rotate-12 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-cyan-500/10 blur-2xl" />
      </div>

      {/* Subtle grid overlay */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.08]" />

      {/* Floating emojis */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-10 top-24 text-3xl opacity-70"
      >
        
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, 14, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute right-16 top-44 text-3xl opacity-70"
      >
      
      </motion.div>
      <motion.div
        aria-hidden
        animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute left-20 bottom-40 text-3xl opacity-70"
      >
        
      </motion.div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 mx-4 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_10px_60px_rgba(139,92,246,0.25)]"
      >
        {/* Animated border glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-3xl [mask-image:radial-gradient(40%_60%_at_50%_50%,black,transparent)]">
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-fuchsia-500/30 via-purple-500/30 to-cyan-500/30 blur" />
        </div>

        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            className="relative mb-7 h-24 w-24"
          >
            <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-tr from-purple-400 to-pink-400" />
            <div className="absolute inset-2 flex items-center justify-center rounded-full bg-gradient-to-br from-[#0c0f25] to-[#0b1022]">
              <span className="text-3xl">👥</span>
            </div>
          </motion.div>

          {/* Typewriter heading */}
          <motion.h1
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="mb-4 text-4xl font-extrabold tracking-tight text-white md:text-6xl"
          >
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
              {currentText}
            </span>
            <span className="ml-1 inline-block h-10 align-middle text-white/70 md:h-14">
              <span className="inline-block w-[2px] animate-pulse bg-white/70 align-middle" style={{ height: '1em' }} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="mx-auto mb-7 max-w-2xl text-base text-gray-300 md:text-lg"
          >
            We’re putting the final touches on a reveal that celebrates the talent, grit, and creativity driving Sabrang.
          </motion.p>

          
        </div>
      </motion.div>

      
    </div>
  );
}
