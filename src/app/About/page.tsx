'use client';

import React from 'react';
import Image from 'next/image';
import Logo from '../../../components/Logo';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../../components/NavigationContext';
import { Home, Info, Calendar, Star, Clock, Users, HelpCircle, Handshake, Mail, X } from 'lucide-react';
 

const AboutPage = () => {
  // mobile menu state
  const router = useRouter();
  const { navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const mobileNavItems: { title: string; href: string; icon: React.ReactNode }[] = [
    { title: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
    { title: 'Schedule', href: '/schedule/progress', icon: <Clock className="w-5 h-5" /> },
    { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
    { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
    { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
    { title: 'Contact', href: '/Contact', icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden flex flex-col">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/about-section/about_back.webp)'
        }}
      />
      
      {/* Black Overlay for better text readability with subtle glass blur */}
      <div className="fixed inset-0 -z-10 bg-black/40 backdrop-blur-sm md:backdrop-blur" />
      
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

      {/* Main Content Container */}
      <div className="relative z-10 pb-16 flex-grow">
        {/* Hero Section */}
        <section 
          className="min-h-screen flex items-center justify-center relative"
          style={{
            backgroundImage: 'url(/images/about-section/about-bg.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Hero Background Overlay */}
          <div className="absolute inset-0 bg-black/60" />
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <h1 className="text-6xl md:text-8xl font-extrabold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-300">
                ABOUT
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600 drop-shadow-2xl">
                SABRANG
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium" style={{ fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}>
              Experience the grandest cultural fest. Unleash your talent, witness captivating performances, 
              and create unforgettable memories that will last a lifetime.
            </p>
          </div>
        </section>

        {/* What is Sabrang Section */}
        <section className="py-20 px-6 relative">
          {/* Mobile background image with overlay */}
          <div
            className="absolute inset-0 lg:hidden -z-20 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/images/about-section/what_is_sabrang.webp)' }}
          />
          <div className="absolute inset-0 lg:hidden -z-10 bg-black/60" />
          <div className="max-w-7xl mx-auto">
            {/* Hero Image for What is Sabrang */}
            
            
            <div className="grid lg:grid-cols-2 gap-16 items-center relative">
              {/* Left: Image */}
              <div className="relative group hidden lg:block">
                <div className="relative overflow-hidden rounded-2xl h-[500px]">
                  <Image 
                    src="/images/about-section/what_is_sabrang.webp" 
                    alt="What is Sabrang - Cultural Fest Celebration"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority={false}
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                
              </div>
              
              {/* Right: Content */}
              <div className="space-y-6 bg-black/40 py-6 px-6 rounded-xl relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-[#f1e4fe]">
                    What is Sabrang?
                  </span>
                </h2>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  Sabrang isn't just a fest — it's an explosion of talent, creativity, and cosmic energy. 
                  Over three thrilling days, JKLU transforms into a universe of music, dance, art, technology, 
                  and pure celebration.
                </p>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  With a massive prize pool, flagship events, celebrity performances, and non-stop entertainment, 
                  Sabrang is where memories are made and legends are born.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-purple-400 font-medium">Experience the Magic</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why It's OP Section */}
        <section className="py-20 px-6 bg-white/20 backdrop-blur-sm relative overflow-hidden">
          {/* Background Video with Image Fallback */}
          <div className="absolute inset-0 -z-10">
                         {/* Image Fallback - Always visible */}
             <img 
               loading="lazy" decoding="async"
               src="/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.40_42fe13c8.jpg" 
               alt="Why It's OP Background"
               className="w-full h-full object-cover"
             />
            {/* Video Overlay - when loaded */}
            <video 
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay 
              muted 
              loop
              playsInline
              preload="metadata"
              onError={(e) => {
                console.warn('About video failed to load, using image fallback', e);
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
              }}
              onLoadStart={() => console.log('About video loading started')}
              onCanPlay={() => console.log('About video can play')}
            >
              <source src="/videos/optimized/aboutop.mp4" type="video/mp4" />
              <source src="/videos/aboutsection/aboutop.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-pink-900/80"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Content */}
              <div className="space-y-6 bg-black/30 rounded-xl py-8">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-[#fae8ff]">
                    Why It's OP
                  </span>
                  <br />
                  <span className="text-[#fae8ff]">
                    (Overpowered)
                  </span>
                </h2>
                <div className="flex justify-center px-4">
                  <div className="space-y-4 text-left">
                    {[
                      '₹3,00,000+ in prizes for winners and top performers',
                      'Flagship competitions that push creativity and skill',
                      'National-level participation',
                      'Immersive themes every year',
                      'Epic nights with DJs, live bands, and celebrities'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-2"></div>
                        <span className="text-gray-300 text-lg">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Flagship Section */}
        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                  Flagship Showdowns
                </span>
              </h2>
            </div>
            
            {/* Three Vertical Parallel Videos with Image Fallbacks */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
                             {/* Panache Video */}
               <div className="relative group h-[240px] md:h-[600px]">
                 <div className="absolute inset-0 overflow-hidden rounded-lg md:rounded-2xl">
                   {/* Image Fallback - Always visible */}
                   <img 
                     src="/images/about-section/Panache.png" 
                     alt="Panache Fashion Show"
                     className="w-full h-full object-cover"
                   />
                   {/* Video Overlay - when loaded */}
                   <video 
                     className="absolute inset-0 w-full h-full object-cover"
                     autoPlay 
                     muted 
                     loop
                     playsInline
                     preload="metadata"
                     onError={(e) => {
                       console.warn('Panache video failed to load, using image fallback', e);
                       const target = e.target as HTMLVideoElement;
                       target.style.display = 'none';
                     }}
                     onLoadStart={() => console.log('Panache video loading started')}
                     onCanPlay={() => console.log('Panache video can play')}
                   >
                     <source src="/videos/optimized/panache.mp4" type="video/mp4" />
                     <source src="/videos/aboutsection/panache.mp4" type="video/mp4" />
                   </video>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                   <h3 className="text-lg md:text-4xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">Panache</h3>
                   <p className="text-xs md:text-xl text-gray-200 drop-shadow-lg">Glamorous fashion show</p>
                 </div>
               </div>
               
               {/* Band Jam Video */}
               <div className="relative group h-[240px] md:h-[600px]">
                 <div className="absolute inset-0 overflow-hidden rounded-lg md:rounded-2xl">
                   {/* Image Fallback - Always visible */}
                   <img 
                     src="/images/about-section/Bandjam.png" 
                     alt="Band Jam Music Competition"
                     className="w-full h-full object-cover"
                   />
                   {/* Video Overlay - when loaded */}
                   <video 
                     className="absolute inset-0 w-full h-full object-cover"
                     autoPlay 
                     muted 
                     loop
                     playsInline
                     preload="metadata"
                     onError={(e) => {
                       console.warn('Band Jam video failed to load, using image fallback', e);
                       const target = e.target as HTMLVideoElement;
                       target.style.display = 'none';
                     }}
                     onLoadStart={() => console.log('Band Jam video loading started')}
                     onCanPlay={() => console.log('Band Jam video can play')}
                   >
                     <source src="/videos/optimized/bandjam.mp4" type="video/mp4" />
                     <source src="/videos/aboutsection/bandjam.mp4" type="video/mp4" />
                   </video>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                   <h3 className="text-lg md:text-4xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">Band Jam</h3>
                   <p className="text-xs md:text-xl text-gray-200 drop-shadow-lg">Electrifying music</p>
                 </div>
               </div>
               
               {/* Dance Battle Video */}
               <div className="relative group h-[240px] md:h-[600px]">
                 <div className="absolute inset-0 overflow-hidden rounded-lg md:rounded-2xl">
                   {/* Image Fallback - Always visible */}
                   <img 
                     src="/images/about-section/Dance.png" 
                     alt="Dance Battle Competition"
                     className="w-full h-full object-cover"
                   />
                   {/* Video Overlay - when loaded */}
                   <video 
                     className="absolute inset-0 w-full h-full object-cover"
                     autoPlay 
                     muted 
                     loop
                     playsInline
                     preload="metadata"
                     onError={(e) => {
                       console.warn('Dance video failed to load, using image fallback', e);
                       const target = e.target as HTMLVideoElement;
                       target.style.display = 'none';
                     }}
                     onLoadStart={() => console.log('Dance video loading started')}
                     onCanPlay={() => console.log('Dance video can play')}
                   >
                     <source src="/videos/optimized/dance.mp4" type="video/mp4" />
                     <source src="/videos/aboutsection/dance.mp4" type="video/mp4" />
                   </video>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                 </div>
                 <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                   <h3 className="text-lg md:text-4xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg">Dance Battle</h3>
                   <p className="text-xs md:text-xl text-gray-200 drop-shadow-lg">Ultimate dance glory</p>
                 </div>
               </div>
            </div>

            {/* Additional Flagship Cards */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {/* Nukkad Natak */}
              <div className="relative group h-[180px] md:h-[280px] bg-gradient-to-br from-orange-600 to-red-600 rounded-xl md:rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/25" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold mb-3">⭐ FLAGSHIP</div>
                  <h3 className="text-base md:text-2xl font-bold text-white mb-2">Nukkad Natak</h3>
                  <p className="text-xs md:text-sm text-gray-200">Street theatre showcase</p>
                </div>
              </div>

              {/* Spotlight */}
              <div className="relative group h-[180px] md:h-[280px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl md:rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/25" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold mb-3">⭐ FLAGSHIP</div>
                  <h3 className="text-base md:text-2xl font-bold text-white mb-2">Spotlight</h3>
                  <p className="text-xs md:text-sm text-gray-200">Acting excellence</p>
                </div>
              </div>

              {/* Singing Palooza */}
              <div className="relative group h-[180px] md:h-[280px] bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl md:rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/25" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold mb-3">⭐ FLAGSHIP</div>
                  <h3 className="text-base md:text-2xl font-bold text-white mb-2">Singing Palooza</h3>
                  <p className="text-xs md:text-sm text-gray-200">Vocal mastery</p>
                </div>
              </div>

              {/* Step Up */}
              <div className="relative group h-[180px] md:h-[280px] bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl md:rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/25" />
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-6">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold mb-3">⭐ FLAGSHIP</div>
                  <h3 className="text-base md:text-2xl font-bold text-white mb-2">Step Up</h3>
                  <p className="text-xs md:text-sm text-gray-200">Group dance energy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Beyond Competitions Section */}
        <section className="py-20 px-6 bg-black/30 relative">
          {/* Mobile background image with overlay */}
          <div
            className="absolute inset-0 lg:hidden -z-20 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.37_b514dcc5.jpg)' }}
          />
          <div className="absolute inset-0 lg:hidden -z-10 bg-black/60" />
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
              <div className="space-y-6 bg-white/15 py-6 px-6 rounded-xl relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
                    Beyond Competitions
                  </span>
                </h2>
                <div className="space-y-4">
                  {[
                    'DJ Night: Dance till dawn',
                    'Mini Games Arena',
                    'Pre Sabrang Events',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                      <span className="text-gray-300 text-lg">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Right: Image */}
              <div className="relative group hidden lg:block">
                <div className="relative overflow-hidden rounded-2xl">
                  <img 
                    src="/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.37_b514dcc5.jpg" 
                    alt="Beyond Competitions - Live Performance"
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
                
              </div>
            </div>
          </div>
        </section>

        {/* Final Vibe Section */}
        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm relative">
          {/* Mobile background image with overlay */}
          <div
            className="absolute inset-0 lg:hidden -z-20 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.40_42fe13c8.jpg)' }}
          />
          <div className="absolute inset-0 lg:hidden -z-10 bg-black/60" />
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Image */}
              <div className="relative group hidden lg:block">
                <div className="relative overflow-hidden rounded-2xl">
                  <img 
                    src="/images/backgrounds/about-page/WhatsApp Image 2025-08-13 at 20.04.40_42fe13c8.jpg" 
                    alt="Final Vibe - Live Event Atmosphere"
                    className="w-full h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              </div>
              
              {/* Right: Content */}
              <div className="space-y-6 relative z-10 bg-black/40 p-6 rounded-xl lg:bg-transparent lg:p-0">
                <h2 className="text-4xl md:text-5xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600">
                    The Final Vibe
                  </span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Imagine vibrant lights, roaring crowds, breathtaking performances, and an energy 
                  that doesn't fade until the last beat drops. That's Sabrang more than a fest, 
                  it's an experience you'll remember for years.
                </p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-pink-400 font-medium">Unforgettable Memories</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      

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

export default AboutPage;
