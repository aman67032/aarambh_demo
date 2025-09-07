"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Logo from '../public/images/Logo.svg';
import Link from 'next/link';
// Replaced old Button with custom gradient-pill buttons inline
import createApiUrl from '../src/lib/api';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
    const handleAuthChange = () => {
      checkAuthStatus();
    };
    window.addEventListener('userLoggedIn', handleAuthChange);
    window.addEventListener('userLoggedOut', handleAuthChange);
    return () => {
      window.removeEventListener('userLoggedIn', handleAuthChange);
      window.removeEventListener('userLoggedOut', handleAuthChange);
    };
  }, []);

  const authAbortRef = useRef<AbortController | null>(null);
  const authCooldownRef = useRef<number>(0);
  const checkAuthStatus = useCallback(async () => {
    const now = Date.now();
    if (now - authCooldownRef.current < 3000) return; // debounce frequent checks
    authCooldownRef.current = now;
    try {
      if (authAbortRef.current) authAbortRef.current.abort();
      const controller = new AbortController();
      authAbortRef.current = controller;
      const response = await fetch(createApiUrl('/api/user'), {
        credentials: 'include',
        signal: controller.signal,
        cache: 'no-store'
      });
      if (response.ok) {
        const userData = await response.json();
        setIsAuthenticated(true);
        setIsAdmin(userData.isAdmin || false);
        setUserEmail(userData.email);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(createApiUrl('/logout'), {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserEmail('');
      
      // Dispatch custom event to notify other components about logout
      window.dispatchEvent(new CustomEvent('userLoggedOut'));
      
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="w-full fixed top-0 z-50 flex items-center justify-between pl-4 pr-4 sm:pl-25 sm:pr-0">
      {/* Left: Logo */}
      <div className="flex items-center ml-4 sm:ml-14">
        <Link href="/" className="mr-4"></Link>
        <Image src={Logo} alt="Logo" width={56} height={56} />
      </div>

      {/* Center: Main Navbar Links */}
      <div className="flex items-center justify-center flex-1">
		<div className="flex items-center justify-between md:w-fit md:px-6 md:py-3 md:bg-black/40 md:backdrop-blur-xl md:border md:border-white/10 text-white md:rounded-full md:shadow-[0_10px_40px_rgba(168,85,247,0.25)]" data-no-splash="true">
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-white font-medium hover:text-yellow-300 transition">Home</a>
            <a href="/Events" className="text-white font-medium hover:text-yellow-300 transition">Events</a>
            <a href="/About" className="text-white font-medium hover:text-yellow-300 transition">About</a>
            <a href="/Gallery" className="text-white font-medium hover:text-yellow-300 transition">Gallery</a>
            <a href="/Team/team-reveal" className="text-white font-medium hover:text-yellow-300 transition">Team</a>
            <a href="/why-sponsor-us" className="text-white font-medium hover:text-yellow-300 transition">Why Sponsor Us</a>
            <a href="/FAQ" className="text-white font-medium hover:text-yellow-300 transition">FAQ</a>
            <a href="/Contact" className="text-white font-medium hover:text-yellow-300 transition">Contact</a>
            
            {/* Authenticated User Links */}
            {isAuthenticated && (
              <>
                <a href="/dashboard" className="text-white font-medium hover:text-yellow-300 transition">Dashboard</a>
                {isAdmin && (
                  <a href="/admin" className="text-white font-medium hover:text-yellow-300 transition">Admin</a>
                )}
              </>
            )}
          </div>

          {/* Hamburger: Mobile */}
			<div className="md:hidden ml-50">
				<button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu" className="text-white focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav Links */}
			{isOpen && (
				<div className="md:hidden absolute top-20 left-0 right-0 mx-auto w-11/12 bg-black/40 backdrop-blur-xl border border-white/10 text-white rounded-2xl px-4 py-4 shadow-[0_10px_40px_rgba(168,85,247,0.25)] z-40">
            <a href="/" className="block text-white py-2 hover:text-yellow-300">Home</a>
            <a href="/Events" className="block text-white py-2 hover:text-yellow-300">Events</a>
            <a href="/About" className="block text-white py-2 hover:text-yellow-300">About</a>
            <a href="/Gallery" className="block text-white py-2 hover:text-yellow-300">Gallery</a>
            <a href="/Team/team-reveal" className="block text-white py-2 hover:text-yellow-300">Team</a>
            <a href="/why-sponsor-us" className="block text-white py-2 hover:text-yellow-300">Why Sponsor Us</a>
            <a href="/FAQ" className="block text-white py-2 hover:text-yellow-300">FAQ</a>
            <a href="/Contact" className="block text-white py-2 hover:text-yellow-300">Contact</a>
            
            {/* Authenticated Mobile Links */}
            {isAuthenticated ? (
              <>
                <a href="/dashboard" className="block text-white py-2 hover:text-yellow-300">Dashboard</a>
                {isAdmin && (
                  <a href="/admin" className="block text-white py-2 hover:text-yellow-300">Admin</a>
                )}
						<button 
							onClick={handleLogout}
							className="block w-full mt-3 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white text-center py-2 rounded-full shadow-[0_8px_30px_rgba(236,72,153,0.35)] hover:scale-[1.02] transition"
						>
							Logout ({userEmail})
						</button>
              </>
            ) : (
              <a href="/coming-soon" className="block mt-3 w-full">
                <span className="block w-full px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 rounded-lg hover:from-purple-700 hover:via-pink-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-[1.02] transition">Register Now</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Right: Register Now Button or User Menu */}
		<div className="hidden md:flex items-center space-x-4 mr-14">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm">Welcome, {userEmail}</span>
					<button 
						onClick={handleLogout}
						className="relative group overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 px-4 py-2 rounded-full text-white shadow-[0_8px_30px_rgba(236,72,153,0.35)] transition-all duration-500 hover:scale-105"
					>
						<span className="relative z-10">Logout</span>
						<span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
					</button>
          </div>
        ) : (
          <a href="/coming-soon" className="relative inline-flex items-center gap-2 rounded-full px-6 py-3 text-white text-base font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 shadow-[0_10px_40px_rgba(147,51,234,0.3)] hover:shadow-[0_10px_40px_rgba(147,51,234,0.5)] hover:scale-105 transition-all duration-300 transform">
            <span className="relative z-10">Register Now</span>
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-pink-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-500"></span>
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;