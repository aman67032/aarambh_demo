import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide logo when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div 
      className={`fixed top-4 left-4 z-[40] transition-transform duration-300 ease-in-out ${className}`}
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        opacity: isVisible ? 1 : 0
      }}
    >
      <div className="flex items-center justify-center">
        <a href="/" aria-label="Go to homepage">
          <img 
            src="/images/Logo@2x.png" 
            alt="Logo" 
            className="h-10 w-auto lg:h-25 lg:w-36 cursor-pointer" 
            onError={(e) => { 
              (e.target as HTMLImageElement).src = '/images/Logo.svg'; 
            }} 
          />
        </a>
      </div>
    </div>
  );
};

export default Logo;
