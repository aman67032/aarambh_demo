'use client';

import React, { useState, useEffect } from 'react';
import Logo from '../../../components/Logo';
import { Calendar, Users, Handshake, Info, Clock, Star, Mail, Home, HelpCircle, X, ChevronUp, Search, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useNavigation } from '../../../components/NavigationContext';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  animationDelay: number;
  duration: number;
}

// Minimal geometric icon (no emojis). Varies by seed for uniqueness
const DecorativeIcon = ({ seed = 0 }: { seed?: number }) => {
  const variant = seed % 3;
  const stroke = '#C084FC';
  const fill = 'url(#grad)';
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      {variant === 0 && (
        <g>
          <circle cx="14" cy="14" r="8" stroke={stroke} strokeWidth="2" fill="none" />
          <circle cx="14" cy="14" r="4" fill={fill} opacity="0.8" />
        </g>
      )}
      {variant === 1 && (
        <g>
          <rect x="6" y="6" width="16" height="16" rx="4" stroke={stroke} strokeWidth="2" fill="none" />
          <path d="M10 18 L18 10" stroke={stroke} strokeWidth="2" />
          <path d="M10 10 L18 18" stroke={stroke} strokeWidth="2" />
        </g>
      )}
      {variant === 2 && (
        <g>
          <polygon points="14,5 23,21 5,21" fill={fill} opacity="0.85" />
          <polygon points="14,8 20,19 8,19" stroke={stroke} strokeWidth="1.5" fill="none" />
        </g>
      )}
    </svg>
  );
};

const FAQ = () => {
  const router = useRouter();
  const { navigate } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);

  const mobileNavItems: { title: string; href: string; icon: React.ReactNode }[] = [
    { title: 'Home', href: '/?skipLoading=true', icon: <Home className="w-5 h-5" /> },
    { title: 'About', href: '/About', icon: <Info className="w-5 h-5" /> },
    { title: 'Events', href: '/Events', icon: <Calendar className="w-5 h-5" /> },
    { title: 'Highlights', href: '/Gallery', icon: <Star className="w-5 h-5" /> },
    { title: 'Schedule', href: '/schedule/progress', icon: <Clock className="w-5 h-5" /> },
    { title: 'Team', href: '/Team', icon: <Users className="w-5 h-5" /> },
    { title: 'FAQ', href: '/FAQ', icon: <HelpCircle className="w-5 h-5" /> },
    { title: 'Why Sponsor Us', href: '/why-sponsor-us', icon: <Handshake className="w-5 h-5" /> },
    { title: 'Contact', href: '/Contact', icon: <Mail className="w-5 h-5" /> },
  ];

  const faqs = [
    {
      question: "What is Sabrang '25?",
      answer: "Sabrang '25 is the grandest cultural fest, offering a platform for talent, captivating performances, and unforgettable memories. It's a three-day celebration of music, dance, art, technology, and pure creativity.",
      category: "General",
      icon: "🎭"
    },
    {
      question: "How can I participate in Sabrang '25 events?",
      answer: "You can register for various competitions and workshops through our 'Register Now' button on the homepage or by navigating to the Events section. Registration is open for all college students and young professionals.",
      category: "Participation",
      icon: "🎯"
    },
    {
      question: "Is there a registration fee?",
      answer: "Information regarding registration fees for specific events will be provided during the registration process or can be found on the individual event pages. Some events are free while others may have nominal fees.",
      category: "Registration",
      icon: "💰"
    },
    {
      question: "Where will Sabrang '25 take place?",
      answer: "Details about the venue and specific event locations will be announced closer to the event date on our website and social media channels. The event will be held at JKLU campus with multiple venues.",
      category: "Venue",
      icon: "📍"
    },
    {
      question: "Can I attend Sabrang '25 without participating in events?",
      answer: "Yes, you are welcome to attend Sabrang '25 as a spectator to enjoy the performances and overall festive atmosphere. Spectator passes will be available for purchase.",
      category: "Attendance",
      icon: "👥"
    },
    {
      question: "What are the flagship events?",
      answer: "Our flagship events include PANACHE (fashion show), BAND JAM (music festival), and DANCE BATTLE (dance competition). These events feature the highest prize pools and celebrity judges.",
      category: "Events",
      icon: "🏆"
    },
    {
      question: "How can I get updates about Sabrang '25?",
      answer: "Follow us on social media platforms and subscribe to our newsletter for the latest updates, event announcements, and exclusive behind-the-scenes content.",
      category: "Updates",
      icon: "📱"
    },
    {
      question: "Are there accommodation facilities for outstation participants?",
      answer: "Yes, we provide accommodation facilities for outstation participants. Details about accommodation options, pricing, and booking procedures will be shared closer to the event date.",
      category: "Accommodation",
      icon: "🏨"
    }
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Generate random stars (fewer stars on mobile for better performance)
    const generateStars = () => {
      const newStars: Star[] = [];
      const starCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 100;
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          animationDelay: Math.random() * 4,
          duration: Math.random() * 3 + 2,
        });
      }
      setStars(newStars);
    };

    generateStars();

    // Regenerate stars on window resize for responsive behavior
    const handleResize = () => {
      generateStars();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white font-sans relative overflow-hidden flex flex-col">
      {/* Background Image */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat bg-attachment-fixed"
        style={{
          backgroundImage: 'url(/images/backgrounds/faq.webp)',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Black Overlay for better text readability - Applied to entire page */}
      <div className="fixed inset-0 -z-10 bg-black/60" />

      {/* Logo and sidebar */}
      <Logo className="block" />

      {/* Mobile hamburger (same style as About section) */}
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
      <div className="relative z-10 pb-16 flex-grow">
        {/* Hero Section */}
        <section 
          className="min-h-[60vh] sm:min-h-screen flex items-center justify-center relative px-4 sm:px-6"
        >
          <div className="max-w-7xl mx-auto text-center relative z-10 px-4 sm:px-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 sm:mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-300">
                FREQUENTLY
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-600 drop-shadow-2xl">
                ASKED QUESTIONS
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
              Find answers to all your questions about Sabrang '25. Everything you need to know about participation, 
              events, registration, and more.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-4 sm:px-0">
          
        </div>
      </div>
        </section>

        {/* FAQ Section */}
        <section className="py-4 sm:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Header + divider */}
            <div className="text-center mb-8 sm:mb-14">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Got Questions?
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2">
                We've compiled the most common questions to help you get started. Can't find what you're looking for? 
                <button className="text-purple-400 hover:text-purple-300 transition-colors ml-2">
                  Contact us directly
                </button>
              </p>
              <div className="mt-6 sm:mt-8 flex items-center justify-center">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />
              </div>
            </div>

            {/* FAQ Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="group relative h-full"
                >
                  {/* Layered glow and accent edge */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 blur opacity-40 group-hover:opacity-60 transition" />
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl bg-gradient-to-b from-purple-400 via-pink-400 to-blue-400 opacity-70" />
               
                  <div className="relative bg-gradient-to-br from-gray-900/85 via-gray-900/70 to-gray-900/85 backdrop-blur-md border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl transition-all duration-500 transform hover:translate-y-[-2px] hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)] h-full flex flex-col">
                    {/* Subtle grid texture */}
                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,.2) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                    {/* Corner cut */}
                    <div className="absolute -right-6 -top-6 w-16 h-16 rotate-45 bg-gradient-to-br from-white/10 to-transparent" />
                    {/* Question Header */}
                    <button
                      onClick={() => toggle(index)}
                      className="w-full text-left p-5 sm:p-6 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-inset group active:scale-[0.99] transition-transform duration-150 touch-manipulation flex-shrink-0"
                      aria-expanded={openIndex === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <div className="flex items-start justify-between min-h-[72px]">
                        <div className="flex items-start gap-3 sm:gap-4 flex-1">
                          <div className="flex-shrink-0 rounded-lg bg-white/5 border border-white/10 p-2 shadow-sm">
                            <DecorativeIcon seed={index} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white group-hover:text-purple-200 transition-colors duration-300 leading-relaxed">
                              {faq.question}
                            </h3>
                            <div className="mt-1.5 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 text-purple-200 border border-white/10">
                              {faq.category}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`transform transition-all duration-500 text-xl sm:text-2xl flex-shrink-0 ml-3 sm:ml-4 ${
                            openIndex === index 
                              ? 'rotate-0 text-purple-400 scale-110' 
                              : 'rotate-180 text-gray-400 group-hover:text-purple-400 group-hover:scale-105'
                          }`}
                          aria-hidden="true"
                        >
                          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                        </span>
                      </div>
                    </button>
 
                    {/* Answer Container */}
                    <div
                      id={`faq-answer-${index}`}
                      className={`px-5 sm:px-6 transition-all duration-500 ease-in-out overflow-hidden flex-1 ${
                        openIndex === index 
                          ? 'max-h-96 opacity-100 pb-5 sm:pb-6' 
                          : 'max-h-0 opacity-0 pb-0'
                      }`}
                      aria-hidden={openIndex !== index}
                    >
                      <div className="border-t border-white/10 pt-3 sm:pt-4">
                        <p className="text-gray-200 leading-relaxed text-sm sm:text-base md:text-lg">
                          {faq.answer}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Need more help?</span>
                          </div>
                          <button className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium transition-colors">
                            Contact Support
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
 
            {/* No Results Message (no emoji) */}
            {filteredFaqs.length === 0 && searchTerm && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-bold text-gray-300 mb-4">No questions found</h3>
                <p className="text-gray-400 mb-6">
                  Try searching with different keywords or browse all questions above.
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-medium transition-colors duration-300"
                >
                  Clear Search
                </button>
              </div>
            )}

            {/* Bottom CTA */}
            <div className="text-center mt-12 sm:mt-16 md:mt-20">
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mx-4 sm:mx-0">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
                  Still have questions?
                </h3>
                <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                  Our team is here to help! Reach out to us and we'll get back to you as soon as possible.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button 
                    onClick={() => router.push('/Contact')}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  >
                    Contact Support
                  </button>
                  <button 
                    onClick={() => router.push('/Events')}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all duration-300 text-sm sm:text-base"
                  >
                    View All Events
                  </button>
                </div>
          </div>
        </div>
      </div>
        </section>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 touch-manipulation"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      )}
      
      {/* Footer is rendered globally in AppShell */}
    </div>
  );
};

export default FAQ;