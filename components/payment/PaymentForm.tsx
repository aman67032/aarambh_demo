import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Ticket, X } from 'lucide-react';

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

interface PaymentFormProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  selectedEvents: number[];
  selectedCombo?: string;
  onPaymentInitiate: (customerDetails: CustomerDetails, couponCode?: string) => void;
  isLoading: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  isOpen,
  onClose,
  totalAmount,
  selectedEvents,
  selectedCombo,
  onPaymentInitiate,
  isLoading
}) => {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{
    isValidating: boolean;
    isValid: boolean;
    message: string;
    discountAmount: number;
  }>({
    isValidating: false,
    isValid: false,
    message: '',
    discountAmount: 0
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!customerDetails.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!customerDetails.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerDetails.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!customerDetails.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(customerDetails.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onPaymentInitiate(customerDetails, couponCode || undefined);
    }
  };

  const validateCoupon = async (code: string) => {
    if (!code.trim()) {
      setCouponStatus({
        isValidating: false,
        isValid: false,
        message: '',
        discountAmount: 0
      });
      return;
    }

    setCouponStatus(prev => ({ ...prev, isValidating: true }));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/validate-promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          promoCode: code, 
          orderAmount: totalAmount 
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setCouponStatus({
          isValidating: false,
          isValid: true,
          message: `₹${result.data.discountAmount} discount applied!`,
          discountAmount: result.data.discountAmount
        });
      } else {
        setCouponStatus({
          isValidating: false,
          isValid: false,
          message: result.error || 'Invalid coupon code',
          discountAmount: 0
        });
      }

    } catch (error) {
      setCouponStatus({
        isValidating: false,
        isValid: false,
        message: 'Error validating coupon',
        discountAmount: 0
      });
    }
  };

  const handleCouponChange = (value: string) => {
    setCouponCode(value.toUpperCase());
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateCoupon(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-purple-400" />
            Complete Payment
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-purple-300 mb-1">
                  {couponStatus.discountAmount > 0 ? 'Final Amount' : 'Total Amount'}
                </div>
                <div className="text-2xl font-bold text-green-400">
                  ₹{totalAmount - couponStatus.discountAmount}
                </div>
                {couponStatus.discountAmount > 0 && (
                  <div className="text-sm text-white/60 line-through">
                    Original: ₹{totalAmount}
                  </div>
                )}
              </div>
              {couponStatus.discountAmount > 0 && (
                <div className="text-right">
                  <div className="text-sm text-green-300">Discount</div>
                  <div className="text-lg font-bold text-green-400">
                    -₹{couponStatus.discountAmount}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={customerDetails.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors ${
                  errors.name ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={customerDetails.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors ${
                  errors.email ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="tel"
                value={customerDetails.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400 transition-colors ${
                  errors.phone ? 'border-red-400' : 'border-white/20'
                }`}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
              />
            </div>
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Coupon Code (Optional)
            </label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => handleCouponChange(e.target.value)}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-white/40 focus:outline-none transition-colors ${
                couponStatus.isValid 
                  ? 'border-green-400 focus:border-green-400' 
                  : couponStatus.message && !couponStatus.isValid 
                    ? 'border-red-400 focus:border-red-400'
                    : 'border-white/20 focus:border-purple-400'
              }`}
              placeholder="Enter coupon code"
            />
            {couponStatus.isValidating && (
              <div className="text-sm text-blue-400 mt-1 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                Validating coupon...
              </div>
            )}
            {couponStatus.message && !couponStatus.isValidating && (
              <div className={`text-sm mt-1 ${
                couponStatus.isValid ? 'text-green-400' : 'text-red-400'
              }`}>
                {couponStatus.message}
              </div>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? 'Processing...' : `Pay ₹${totalAmount - couponStatus.discountAmount}`}
          </motion.button>
        </form>

        <div className="mt-4 text-xs text-white/60 text-center">
          By proceeding, you agree to our terms and conditions
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentForm;
