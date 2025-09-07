'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import EventCard from '../src/app/Events/EventCard';

type EventItem = {
  title: string;
  image: string;
  description?: string;
  date?: string;
  prize?: string;
  registration?: string;
  video?: string;
};

type EventCarouselProps = {
  events: EventItem[];
  initialIndex?: number;
};

export default function EventCarousel({ events, initialIndex = 0 }: EventCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const total = events.length;
  const currentEvent = events[currentIndex];

  const getVideoSrc = useCallback((index: number) => {
    const event = events[index];
    return event?.video || `/video/loadingvideo.mp4`;
  }, [events]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrev();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case 'Home':
          event.preventDefault();
          goToIndex(0);
          break;
        case 'End':
          event.preventDefault();
          goToIndex(total - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, goToIndex, total]);

  // Handle video source change
  useEffect(() => {
    if (videoRef.current) {
      setIsLoading(true);
      setVideoError(false);
      
      const video = videoRef.current;
      const newSrc = getVideoSrc(currentIndex);
      
      video.src = newSrc;
      video.load();
      
      const handleCanPlay = () => {
        setIsLoading(false);
        video.play().catch((error) => {
          console.warn('Video play failed:', error);
          setVideoError(true);
        });
      };

      const handleError = () => {
        console.error('Video loading error');
        setVideoError(true);
        setIsLoading(false);
      };

      video.addEventListener('canplay', handleCanPlay, { once: true });
      video.addEventListener('error', handleError, { once: true });

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
      };
    }
  }, [currentIndex, getVideoSrc]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Single video element as page background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onError={(e) => {
          console.warn('Event carousel video failed to load, using fallback image', e);
          setVideoError(true);
        }}
      />
      
      {/* Fallback background image if video fails */}
      {videoError && (
        <div 
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            backgroundImage: `url(${currentEvent?.image || '/images/building-6011756_1280.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
          <div className="text-white text-lg">Loading video...</div>
        </div>
      )}
      
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />

      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <EventCard event={currentEvent} variant="glass" />

        {/* Navigation controls */}
        <div className="mt-8 flex items-center gap-4">
          <button
            aria-label="Previous event"
            className="rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            onClick={goToPrev}
          >
            ← Prev
          </button>
          
          {/* Event indicators */}
          <div className="flex items-center gap-2">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => goToIndex(i)}
                className={`h-2 w-2 rounded-full transition-all duration-200 hover:scale-125 ${
                  i === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
                aria-label={`Go to event ${i + 1}`}
              />
            ))}
          </div>
          
          <button
            aria-label="Next event"
            className="rounded-full border border-white/30 bg-white/10 hover:bg-white/20 text-white px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            onClick={goToNext}
          >
            Next →
          </button>
        </div>

        {/* Event counter */}
        <div className="mt-4 text-white/70 text-sm">
          {currentIndex + 1} of {total} events
        </div>
      </div>
    </div>
  );
}


