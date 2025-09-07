"use client";

import { cn } from '../../../components/lib/utils';

interface EventProps {
  event: {
    title: string;
    image: string;
    description?: string;
    date?: string;
    prize?: string;
    registration?: string;
    video?: string;
  };
  outline?: 'gold' | 'silver';
  variant?: 'default' | 'glass';
}

export default function EventCard({ event, outline, variant = 'default' }: EventProps) {
  if (!event) return null;

  let borderClass = 'border-t-2';
  if (outline === 'gold') borderClass += ' border-yellow-400';
  else if (outline === 'silver') borderClass += ' border-gray-300';
  else borderClass += ' border-transparent';

  return (
    <div className={cn('relative rounded-2xl group metallic-border w-full')} data-no-splash="true">
      <div className={cn('block rounded-2xl w-full', borderClass)}>
        {/* Image as the Card - optimized for mobile */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black w-full">
          <img
            src={event.image || "/images/building-6011756_1280.jpg"}
            alt={event.title}
            className="block w-full h-auto min-h-[200px] sm:min-h-[250px] object-cover"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />

          {/* Event Content Overlay - responsive padding and text sizes */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 text-white">
            <h2 className="text-lg sm:text-xl lg:text-3xl font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight drop-shadow-lg">
              {event.title}
            </h2>
            {event.description && (
              <p className="text-xs sm:text-sm lg:text-base text-white/90 mb-3 sm:mb-4 lg:mb-6 leading-relaxed drop-shadow-lg line-clamp-2 sm:line-clamp-3">
                {event.description}
              </p>
            )}
            <div className="space-y-1 sm:space-y-2 lg:space-y-3 mb-3 sm:mb-4 lg:mb-6">
              {event.date && (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-yellow-400 font-semibold text-sm">📅</span>
                  <span className="text-white/90 text-xs sm:text-sm">{event.date}</span>
                </div>
              )}
              {event.prize && (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-yellow-400 font-semibold text-sm">🏆</span>
                  <span className="text-white/90 text-xs sm:text-sm">Prize: {event.prize}</span>
                </div>
              )}
            </div>
            <a
              href="/coming-soon"
              className="inline-block px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
            >
              {event.registration || "Register Now"}
            </a>
          </div>
        </div>
      </div>
      <style jsx>{`
        .group:hover.card-border-gradient,
        .group:focus.card-border-gradient {
          background: transparent !important;
        }
        .metallic-border {
          position: relative;
        }
        .metallic-border::before {
          display: none;
          display: none;
        }
        
        /* Text clamping utilities for mobile */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* Smooth transitions for mobile interactions */
        @media (max-width: 768px) {
          .group {
            transition: transform 0.2s ease-in-out;
          }
          
          .group:active {
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
}