'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SkipForward, Play, Pause } from 'lucide-react';

interface LoadingPageProps {
  onComplete: () => void;
  isVisible: boolean;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onComplete, isVisible }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [isMorphing, setIsMorphing] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        setVideoLoaded(true);
        setIsPlaying(true);
        video.play().catch(console.error);
        setShowSkipButton(true);
      };

      const handleTimeUpdate = () => {
        if (video.duration) {
          const currentProgress = (video.currentTime / video.duration) * 100;
          setProgress(currentProgress);
        }
      };

      const handleEnded = () => {
        setIsMorphing(true);
        // Start morphing animation
        setTimeout(() => {
          onComplete();
        }, 1500); // Morphing duration
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [isVisible, onComplete]);

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onComplete();
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Cosmic background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-20" />
      
              {/* Animated stars effect */}
        <div className="absolute inset-0 overflow-hidden">
          {useMemo(() => Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full star-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          )), [])}
        </div>

      {/* Video container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          className="w-full h-full object-cover cursor-pointer"
          onClick={handleVideoClick}
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/loadingvideo2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Video controls overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!isPlaying && videoLoaded && (
            <div className="bg-black bg-opacity-50 rounded-full p-4 backdrop-blur-sm">
              <Play className="w-12 h-12 text-white" />
            </div>
          )}
        </div>

        {/* Skip button */}
        {showSkipButton && (
          <button
            onClick={handleSkip}
            className="absolute top-8 right-8 bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-6 py-3 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
          >
            <SkipForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Skip</span>
          </button>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="bg-black bg-opacity-30 rounded-full h-2 backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Morphing transition overlay */}
        {isMorphing && (
          <div className="absolute inset-0 bg-black morphing-overlay">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-2xl font-bold morphing-text">
                Welcome to Sabrang 2025
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingPage;
