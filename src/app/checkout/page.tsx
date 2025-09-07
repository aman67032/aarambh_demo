'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Package, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Check, 
  Plus, 
  Minus,
  CreditCard,
  Shield,
  ArrowLeft,
  Crown,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ComingSoonOverlay from '../../../components/ComingSoonOverlay';
import Logo from '../../../components/Logo';
import PaymentForm from '../../../components/payment/PaymentForm';
import { usePayment } from '../../hooks/usePayment';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  endTime: string;
  image: string;
  description: string;
  venue: string;
  price: string;
  capacity: string;
  genre: string;
  category: string;
  isFlagship: boolean;
}

interface ComboPackage {
  id: string;
  name: string;
  description: string;
  events: Event[];
  originalPrice: number;
  comboPrice: number;
  discount: number;
  savings: number;
  badge: string;
  color: string;
}

const events: Event[] = [
  {
    id: 1,
    title: "RAMPWALK - PANACHE - THEME BASED",
    date: "25.12.2024",
    time: "19:00",
    endTime: "22:00",
    image: "/images/about-section/Panache.png",
    description: "Sabrang's grandest fashion extravaganza. This year's theme-based rampwalk challenges participants to blend narrative with high fashion, showcasing creativity and stage presence.",
    venue: "Main Auditorium",
    price: "₹85-120",
    capacity: "3,000 people",
    genre: "Fashion Show",
    category: "Flagship",
    isFlagship: true
  },
  {
    id: 2,
    title: "BANDJAM",
    date: "27.12.2024",
    time: "19:30",
    endTime: "23:00",
    image: "/images/about-section/Bandjam.png",
    description: "A showdown of student bands performing original compositions and covers. From rock and indie to classical fusion.",
    venue: "Open Air Amphitheater",
    price: "₹60",
    capacity: "5,000 people",
    genre: "Music Festival",
    category: "Flagship",
    isFlagship: true
  },
  {
    id: 3,
    title: "DANCE BATTLE",
    date: "28.12.2024",
    time: "18:00",
    endTime: "21:00",
    image: "/images/about-section/Dance.png",
    description: "A one-on-one and crew vs. crew elimination dance face-off featuring hip-hop, freestyle, krumping, and fusion styles.",
    venue: "Dance Studio",
    price: "₹45",
    capacity: "1,500 people",
    genre: "Dance Competition",
    category: "Flagship",
    isFlagship: true
  },
  {
    id: 4,
    title: "STEP UP",
    date: "01.01.2025",
    time: "18:00",
    endTime: "21:30",
    image: "/images/home2.png",
    description: "A high-energy group dance event where choreography, synchronization, stage usage, and innovation are key.",
    venue: "Dance Studio",
    price: "₹40",
    capacity: "1,200 people",
    genre: "Group Dance",
    category: "Flagship",
    isFlagship: true
  },
  {
    id: 5,
    title: "ECHOES OF NOOR",
    date: "02.01.2025",
    time: "16:00",
    endTime: "18:00",
    image: "/images/Logo@2x.png",
    description: "A spoken word and poetry event celebrating the festival's theme, 'Noorwana'. Artists perform original pieces reflecting on light, cosmos, and inner luminescence.",
    venue: "Literature Hall",
    price: "Free",
    capacity: "150 people",
    genre: "Spoken Word",
    category: "Creative Arts",
    isFlagship: false
  },
  {
    id: 6,
    title: "TECH TALK - AI WORKSHOP",
    date: "28.12.2024",
    time: "18:00",
    endTime: "20:00",
    image: "/images/Logo@2x.png",
    description: "An interactive workshop on Artificial Intelligence and Machine Learning for beginners.",
    venue: "Tech Lab",
    price: "₹30",
    capacity: "100 people",
    genre: "Workshop",
    category: "Technical",
    isFlagship: false
  },
  {
    id: 7,
    title: "PHOTOGRAPHY CONTEST",
    date: "25.12.2024",
    time: "19:00",
    endTime: "21:00",
    image: "/images/Logo@2x.png",
    description: "Capture the essence of Sabrang through your lens. Submit your best shots for a chance to win exciting prizes.",
    venue: "Exhibition Hall",
    price: "₹20",
    capacity: "200 people",
    genre: "Competition",
    category: "Creative Arts",
    isFlagship: false
  }
];

const comboPackages: ComboPackage[] = [
  {
    id: 'flagship-combo',
    name: 'Flagship Combo',
    description: 'All flagship events at an unbeatable price',
    events: events.filter(e => e.isFlagship),
    originalPrice: 230,
    comboPrice: 180,
    discount: 22,
    savings: 50,
    badge: 'Most Popular',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'complete-combo',
    name: 'Complete Experience',
    description: 'All events including creative arts and special shows',
    events: events,
    originalPrice: 230,
    comboPrice: 200,
    discount: 13,
    savings: 30,
    badge: 'Best Value',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'premium-combo',
    name: 'Premium VIP',
    description: 'Flagship events with VIP access and exclusive perks',
    events: events.filter(e => e.isFlagship),
    originalPrice: 230,
    comboPrice: 250,
    discount: 0,
    savings: 0,
    badge: 'VIP Access',
    color: 'from-yellow-500 to-orange-500'
  }
];

export default function CheckoutPage() {
  const [selectedCombo, setSelectedCombo] = useState<string>('');
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const router = useRouter();
  const { createOrder, processPayment, isLoading, isSDKReady } = usePayment();

  // Helper function to check if two time ranges overlap
  const isTimeOverlapping = (start1: string, end1: string, start2: string, end2: string) => {
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const start1Min = timeToMinutes(start1);
    const end1Min = timeToMinutes(end1);
    const start2Min = timeToMinutes(start2);
    const end2Min = timeToMinutes(end2);

    // Check if the time ranges overlap
    return start1Min < end2Min && start2Min < end1Min;
  };

  const handleEventToggle = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    setSelectedEvents(prev => {
      if (prev.includes(eventId)) {
        // Remove event if already selected
        return prev.filter(id => id !== eventId);
      } else {
        // Check for time conflicts before adding
        const hasTimeConflict = prev.some(selectedId => {
          const selectedEvent = events.find(e => e.id === selectedId);
          return selectedEvent && 
                 selectedEvent.date === event.date && 
                 isTimeOverlapping(selectedEvent.time, selectedEvent.endTime, event.time, event.endTime);
        });

        if (hasTimeConflict) {
          // Show error message or prevent selection
          const conflictingEvent = prev.find(selectedId => {
            const selectedEvent = events.find(e => e.id === selectedId);
            return selectedEvent && 
                   selectedEvent.date === event.date && 
                   isTimeOverlapping(selectedEvent.time, selectedEvent.endTime, event.time, event.endTime);
          });
          const conflictingEventData = events.find(e => e.id === conflictingEvent);
          alert(`Cannot select this event. You already have "${conflictingEventData?.title}" selected from ${conflictingEventData?.time} to ${conflictingEventData?.endTime} on ${event.date}. Please deselect the conflicting event first.`);
          return prev;
        }

        return [...prev, eventId];
      }
    });
  };

  const handleQuantityChange = (eventId: number, quantity: number) => {
    if (quantity < 0) return;
    setQuantities(prev => ({
      ...prev,
      [eventId]: quantity
    }));
  };

  const hasTimeConflict = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return false;

    return selectedEvents.some(selectedId => {
      const selectedEvent = events.find(e => e.id === selectedId);
      return selectedEvent && 
             selectedEvent.id !== eventId &&
             selectedEvent.date === event.date && 
             isTimeOverlapping(selectedEvent.time, selectedEvent.endTime, event.time, event.endTime);
    });
  };

  const getConflictMessage = (eventId: number) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return '';

    const conflictingEvent = selectedEvents.find(selectedId => {
      const selectedEvent = events.find(e => e.id === selectedId);
      return selectedEvent && 
             selectedEvent.id !== eventId &&
             selectedEvent.date === event.date && 
             isTimeOverlapping(selectedEvent.time, selectedEvent.endTime, event.time, event.endTime);
    });

    if (conflictingEvent) {
      const conflictingEventData = events.find(e => e.id === conflictingEvent);
      return `Time conflict with ${conflictingEventData?.title} (${conflictingEventData?.time}-${conflictingEventData?.endTime})`;
    }
    return '';
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Add combo package price if selected
    if (selectedCombo) {
      const combo = comboPackages.find(c => c.id === selectedCombo);
      if (combo) {
        total += combo.comboPrice;
      }
    }
    
    // Add individual events price
    total += selectedEvents.reduce((eventTotal, eventId) => {
      const event = events.find(e => e.id === eventId);
      const quantity = quantities[eventId] || 1;
      if (!event) return eventTotal;
      
      const price = event.price === 'Free' ? 0 : parseInt(event.price.replace('₹', ''));
      return eventTotal + (price * quantity);
    }, 0);
    
    return total;
  };

  const handleCheckout = () => {
    if (!isSDKReady) {
      alert('Payment system is still loading. Please wait a moment and try again.');
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentInitiate = async (customerDetails: any, couponCode?: string) => {
    try {
      const paymentOptions = {
        orderAmount: calculateTotal(),
        customerDetails,
        selectedEvents,
        selectedCombo,
        couponCode
      };

      const orderResponse = await createOrder(paymentOptions);
      
      if (orderResponse.success && orderResponse.data) {
        // Close the payment form
        setShowPaymentForm(false);
        
        // Initiate payment
        await processPayment(orderResponse.data.paymentSessionId);
      } else {
        alert(orderResponse.error || 'Failed to create order. Please try again.');
      }
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const selectedComboData = comboPackages.find(c => c.id === selectedCombo);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {showComingSoon && <ComingSoonOverlay />}
      
      <PaymentForm
        isOpen={showPaymentForm}
        onClose={() => setShowPaymentForm(false)}
        totalAmount={calculateTotal()}
        selectedEvents={selectedEvents}
        selectedCombo={selectedCombo}
        onPaymentInitiate={handlePaymentInitiate}
        isLoading={isLoading}
      />
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/10 via-transparent to-cyan-900/10" />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/5 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/3 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Logo className="block" />
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <ShoppingCart className="w-4 h-4" />
            <span>Checkout</span>
          </div>
        </div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 title-glow-animation">
            Choose Your
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Experience
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Select combo packages and individual events to create your perfect Sabrang experience. Mix and match to get the best value!
          </p>
        </motion.div>


        <div className="max-w-7xl mx-auto min-h-screen">
          <div className="flex gap-8 min-h-screen">
            {/* Main Content */}
            <div className="flex-1 space-y-12">
              {/* Combo Packages Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  Combo Packages
                </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {comboPackages.map((combo) => (
                        <motion.div
                          key={combo.id}
                          whileHover={{ scale: 1.02 }}
                          className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                            selectedCombo === combo.id
                              ? 'border-purple-400 bg-purple-500/10'
                              : 'border-white/20 bg-white/5 hover:border-white/40'
                          }`}
                          onClick={() => setSelectedCombo(combo.id)}
                        >
                          {combo.badge && (
                            <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${combo.color} text-white`}>
                              {combo.badge}
                            </div>
                          )}
                          
                          <div className="mb-4">
                            <h3 className="text-xl font-bold mb-2">{combo.name}</h3>
                            <p className="text-white/70 text-sm">{combo.description}</p>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            {combo.events.map((event) => (
                              <div key={event.id} className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                <span className="text-white/80">{event.title}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-green-400">₹{combo.comboPrice}</span>
                              {combo.originalPrice > combo.comboPrice && (
                                <span className="text-sm text-white/50 line-through">₹{combo.originalPrice}</span>
                              )}
                            </div>
                            {combo.savings > 0 && (
                              <div className="text-sm text-green-400 font-medium">
                                Save ₹{combo.savings}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
              </motion.div>

              {/* Individual Events Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-blue-400" />
                        Individual Events
                      </h2>
                      {selectedEvents.length > 0 && (
                        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 mb-4">
                          <div className="text-sm text-blue-300 mb-2">
                            <strong>Selected Events:</strong> {selectedEvents.length}
                          </div>
                          <div className="text-xs text-blue-200">
                            {selectedEvents.map(id => {
                              const event = events.find(e => e.id === id);
                              return event ? `${event.title} (${event.date} ${event.time}-${event.endTime})` : '';
                            }).join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {events.map((event) => {
                        const isSelected = selectedEvents.includes(event.id);
                        const hasConflict = hasTimeConflict(event.id);
                        const conflictMessage = getConflictMessage(event.id);
                        const isDisabled = hasConflict && !isSelected;
                        
                        return (
                          <motion.div
                            key={event.id}
                            whileHover={!isDisabled ? { scale: 1.01 } : {}}
                            className={`p-6 rounded-2xl border transition-all ${
                              isSelected
                                ? 'border-purple-400 bg-purple-500/10'
                                : isDisabled
                                ? 'border-red-400/50 bg-red-500/5 cursor-not-allowed opacity-60'
                                : 'border-white/20 bg-white/5 hover:border-white/40 cursor-pointer'
                            }`}
                            onClick={() => !isDisabled && handleEventToggle(event.id)}
                          >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-bold">{event.title}</h3>
                                <div className="flex items-center gap-2">
                                  {event.isFlagship && (
                                    <Crown className="w-4 h-4 text-yellow-400" />
                                  )}
                                  <span className="text-lg font-bold text-green-400">
                                    {event.price}
                                  </span>
                                </div>
                              </div>
                              
                              <p className="text-white/70 text-sm mb-3">{event.description}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-white/60">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {event.date}
                                </div>
                                <div className={`flex items-center gap-1 ${isDisabled ? 'text-red-400' : ''}`}>
                                  <Clock className="w-4 h-4" />
                                  {event.time} - {event.endTime}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {event.venue}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {event.capacity}
                                </div>
                              </div>
                              
                              {isDisabled && conflictMessage && (
                                <div className="mt-2 text-sm text-red-400 flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {conflictMessage}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {selectedEvents.includes(event.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4 pt-4 border-t border-white/20"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-white/70">Quantity:</span>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantityChange(event.id, (quantities[event.id] || 1) - 1);
                                    }}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="w-8 text-center font-medium">
                                    {quantities[event.id] || 1}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantityChange(event.id, (quantities[event.id] || 1) + 1);
                                    }}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                        );
                      })}
                    </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="w-1/3 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 h-screen overflow-y-auto"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 h-full flex flex-col m-2">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Order Summary
                  </h3>
                  
                  <div className="space-y-4 mb-6 flex-1">
                    {/* Combo Package */}
                    {selectedComboData && (
                      <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-purple-300">{selectedComboData.name}</span>
                          <span className="text-green-400 font-bold">₹{selectedComboData.comboPrice}</span>
                        </div>
                        <div className="text-sm text-purple-200">
                          {selectedComboData.events.length} events included
                        </div>
                      </div>
                    )}
                    
                    {/* Individual Events */}
                    {selectedEvents.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-white/70 mb-2">Individual Events:</div>
                        {selectedEvents.map((eventId) => {
                          const event = events.find(e => e.id === eventId);
                          const quantity = quantities[eventId] || 1;
                          if (!event) return null;
                          
                          const price = event.price === 'Free' ? 0 : parseInt(event.price.replace('₹', ''));
                          return (
                            <div key={eventId} className="flex items-center justify-between text-sm">
                              <div>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs text-white/60">Qty: {quantity}</div>
                              </div>
                              <span className="text-green-400 font-bold">
                                ₹{price * quantity}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Show message if nothing selected */}
                    {!selectedCombo && selectedEvents.length === 0 && (
                      <div className="text-center text-white/50 py-8">
                        Select combo packages or individual events to get started
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-white/20 pt-4 mb-6">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-400">₹{calculateTotal()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    disabled={!selectedCombo && selectedEvents.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Register
                  </button>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/60">
                    <Shield className="w-4 h-4" />
                    <span>Secure payment processing</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
