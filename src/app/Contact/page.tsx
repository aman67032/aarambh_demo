'use client';

import React, { useState } from 'react';
import Logo from '../../../components/Logo';
import Footer from '../../../components/Footer';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../../components/NavigationContext';
import { Home, Info, Calendar, Star, Users, HelpCircle, Handshake, Mail as MailIcon, X } from 'lucide-react';

const Contact = () => {
  const router = useRouter();
  const { navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobileNavItems: { title: string; href: string; icon: React.ReactNode }[] = [
    { title: 'Home', href: '/?skipLoading=true', icon: <Home className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
    { title: 'Schedule', href: '/schedule', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
    { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
    { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
    { title: 'Contact', href: '/Contact', icon: <MailIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/backgrounds/faq.webp)'
        }}
      />
      
      {/* Black Overlay for better text readability */}
      <div className="fixed inset-0 -z-10 bg-black/60" />
      
      <Logo />

      {/* Mobile hamburger */}
      <button
        aria-label="Open menu"
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 right-4 z-50 p-3 rounded-xl active:scale-95 transition"
      >
        <span className="block h-0.5 bg-white rounded-full w-8 mb-1" />
        <span className="block h-0.5 bg-white/90 rounded-full w-6 mb-1" />
        <span className="block h-0.5 bg-white/80 rounded-full w-4" />
      </button>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
          <div className="absolute top-4 right-4">
            <button
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="pt-20 px-6 h-full overflow-y-auto">
            <div className="grid grid-cols-1 gap-3 pb-8">
              {mobileNavItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => { setMobileMenuOpen(false); navigate(item.href); }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20 text-white text-base hover:bg-white/15 active:scale-[0.99] transition text-left"
                >
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/15 border border-white/20">
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Infinity transition handled by AppShell */}
      
      {/* Main Content Container */}
      <div className="relative z-10 pt-24 flex-grow">
        {/* Hero Section */}
        <section className="py-0 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold mb-6 sm:mb-8 leading-tight text-white">
              CONTACT US
            </h1>
          </div>
        </section>

        {/* Organizing Heads Section */}
        <section className="py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                  Organizing Heads
                </span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:gap-8 place-items-center">
            
              {/* Diya */}
              <div className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                <div className="relative h-80 sm:h-96 md:h-[28rem] overflow-hidden">
                  <img 
                    src="/images/OH_images_home/diya.jpeg" 
                    alt="Diya - Organizing Head"
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
                
                <div className="p-5 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Diya
                  </h3>
                  <p className="text-cyan-300 font-medium mb-3">Organizing Head</p>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                    Mastermind of logistics and coordination. Ensuring everything runs smoothly behind the scenes.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-300">Available for queries</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">📧</span>
                      <a href="mailto:diyagarg@jklu.edu.in" className="text-gray-300 underline decoration-white/30 hover:decoration-white">diyagarg@jklu.edu.in</a>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-400">📱</span>
                      <a href="tel:+917296859397" className="text-gray-300 underline decoration-white/30 hover:decoration-white">+91 72968 59397</a>
                    </div>
                  </div>
                </div>
                
                
              </div>

            </div>
          </div>
        </section>

        {/* Registration Team Section */}
        <section className="py-12 px-4 sm:px-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500">
                  Registration Team
                </span>
              </h2>
              <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto">
                Our dedicated team ready to help you with registrations and event queries
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {/* Ayushi Kabra */}
              <div className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                <div className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">AK</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Ayushi Kabra
                  </h3>
                  <p className="text-blue-300 font-medium mb-3">Registrations</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <span className="text-gray-400">📧</span>
                      <a href="mailto:ayushikabra@jklu.edu.in" className="text-gray-300 underline decoration-white/30 hover:decoration-white">ayushikabra@jklu.edu.in</a>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <span className="text-gray-400">📱</span>
                      <a href="tel:+918949941985" className="text-gray-300 underline decoration-white/30 hover:decoration-white">+91 89499 41985</a>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">📋</span>
                </div>
              </div>

              {/* Jayash Gehlot */}
              <div className="group relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500">
                <div className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">JG</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-red-500 bg-clip-text text-transparent">
                    Jayash Gehlot
                  </h3>
                  <p className="text-pink-300 font-medium mb-3">Registrations</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <span className="text-gray-400">📧</span>
                      <a href="mailto:jayashgehlot@jklu.edu.in" className="text-gray-300 underline decoration-white/30 hover:decoration-white">jayashgehlot@jklu.edu.in</a>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm">
                      <span className="text-gray-400">📱</span>
                      <a href="tel:+918306274199" className="text-gray-300 underline decoration-white/30 hover:decoration-white">+91 83062 74199</a>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">🎯</span>
                </div>
              </div>
            </div>
          </div>
        </section>

       
        <div className="relative z-10">
          <Footer />
        </div>
      </div>

      {/* Footer outside main container */}
      {/* Footer is rendered globally in AppShell */}

      <style jsx>{`
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #7c3aed, #db2777);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Animation for floating elements */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Contact;