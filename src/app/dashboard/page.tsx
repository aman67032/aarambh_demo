"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaCalendarAlt, FaTicketAlt, FaHistory, FaCog, FaWhatsapp } from 'react-icons/fa';
import Image from 'next/image';
import createApiUrl from '../../lib/api';
import ProtectedRoute from '../../../components/ProtectedRoute';

interface Event {
  _id: string;
  name: string;
  coordinator: string;
  mobile: string;
  qrID: string;
  date: string;
  status: string;
  whatsappLink: string;
}

interface UserData {
  _id:String,
  name: string;
  email: string;
  profileImage: string;
  registeredEvents: Event[];
  transactionId: string;
  hasEntered: boolean;
  entryTime: string | null;
}

function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(createApiUrl('/api/user'), {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleShare = async () => {
    const qrCodeImage = `${window.location.origin}/images/qrcode-placeholder.png`;
    try {
      if (navigator.share) {
        const response = await fetch(qrCodeImage);
        const blob = await response.blob();
        const file = new File([blob], 'event-qr-code.png', { type: 'image/png' });

        await navigator.share({
          files: [file],
          title: 'My Event QR Code',
          text: 'Scan this QR code for quick event check-in!',
        });
        console.log('QR Code shared successfully!');
      } else {
        alert('Web Share API is not supported in your browser. You can download the QR code instead.');
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
      alert('Failed to share QR code.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center p-4 bg-red-500/20 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p>No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-50 px-4">
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Info blocks */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Header/User Info (no bg) */}
          <div className="max-w-2xl ml-0">
            <h1 className="text-2xl font-bold">Hello, {userData.name}</h1>
            <p className="text-gray-400">{userData.email}</p>
            <p className="text-green-400 text-sm mt-1">Logged in as {userData.name}</p>
          </div>
          {/* Upcoming Events (block) */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 max-w-2xl ml-0">
            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
            {userData.registeredEvents.length > 0 ? (
              <div className="space-y-4">
                {userData.registeredEvents.map((event) => (
                  <div
                    key={event._id}
                    className="bg-white/5 p-4 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold">{event.name}</h3>
                      <p className="text-gray-400">{event.date}</p>
                    </div>
                    <a
                      href={event.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <FaWhatsapp />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No upcoming events</p>
            )}
          </div>
          {/* Event Coordinators (block) */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 max-w-2xl ml-0">
            <h2 className="text-xl font-bold mb-4">Event Coordinators</h2>
            <div className="space-y-6">
              {[...userData.registeredEvents].map((event) => (
                <div key={event._id} className="mb-2">
                  <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
                  <div className="ml-4 text-gray-300">
                    <p className="mb-1">
                      <span className="font-medium text-white">Coordinator:</span> {event.coordinator}
                    </p>
                    <p>
                      <span className="font-medium text-white">Contact:</span> <span className="text-green-400">{event.mobile}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: Ticket Card */}
        <div className="w-full max-w-md mx-auto lg:mx-0 flex flex-col items-center justify-center mt-8 lg:mt-0">
          <h2 className="font-extrabold text-2xl text-white mb-4 drop-shadow font-mono tracking-wider text-center">Your Entry Ticket</h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full"
          >
            <div className="relative w-full shadow-2xl">
              {/* Carnival ticket SVG shape */}
              <svg
                viewBox="0 0 400 220"
                className="absolute inset-0 w-full h-full z-0"
                style={{ pointerEvents: "none" }}
                preserveAspectRatio="none"
              >
                {/* Carnival red background with deep notches */}
                <path
                  d="M40,0 h320 a40,40 0 0 1 40,40 v40 a20,20 0 0 0 0,40 v40 a40,40 0 0 1 -40,40 h-320 a40,40 0 0 1 -40,-40 v-40 a20,20 0 0 0 0,-40 v-40 a40,40 0 0 1 40,-40 z"
                  fill="#e11d48"
                  stroke="#fff"
                  strokeWidth="4"
                />
                {/* Dashed border as a rounded path, more inset */}
                <path
                  d="M50,24 h300 a20,20 0 0 1 20,20 v120 a20,20 0 0 1 -20,20 h-300 a20,20 0 0 1 -20,-20 v-120 a20,20 0 0 1 20,-20 z"
                  fill="none"
                  stroke="#fff"
                  strokeDasharray="12 8"
                  strokeWidth="2"
                />
              </svg>
              {/* Ticket content: horizontal layout */}
              <div className="relative z-10 flex flex-row items-center justify-center p-10 min-h-[220px]">
                {/* QR Code on the left, styled like the sponsor image */}
                <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white/10 mr-8 flex items-center justify-center">
                  <img
                    src={createApiUrl(`/api/qrcode/${userData._id}`)}
                    alt="QR Code"
                    width={160}
                    height={160}
                    className="object-contain w-full h-full"
                  />
                </div>
                {/* Text and actions on the right */}
                <div className="flex flex-col items-start justify-center flex-1">
                  <p className="text-gray-200 text-sm mb-2">Scan this code for quick event check-in.</p>
                  <span className="mt-4 text-xs text-yellow-200 tracking-widest font-mono">ADMIT ONE</span>
                </div>
              </div>
            </div>
            {/* Download and Share buttons outside the ticket */}
            <div className="flex justify-center gap-4 mt-2">
              <a
                href={createApiUrl(`/api/qrcode/${userData._id}`)}
                download="event-qr-code.png"
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-white text-sm font-semibold"
              >
                Download
              </a>
              <button
                onClick={handleShare}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-white text-sm font-semibold"
              >
                Share
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Wrap the component with ProtectedRoute
export default function ProtectedDashboard() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}