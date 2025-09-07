'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TestTube } from 'lucide-react';

// Declare global for Cashfree
declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function DirectPaymentTest() {
  const [paymentSessionId, setPaymentSessionId] = useState('session_y93mN29kHhsiX3LsvwxG1ALsCupbWqV1AYtZ4Vv5dektF7DOWMKUV_9LbLoUJV0gNObmUTWmrj8FotZjfEN1hfaAtLlQzR618WbSyTuKYRfEKUpNYMQo6Vis90spayment');
  const [cashfreeLoaded, setCashfreeLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load Cashfree SDK
  useEffect(() => {
    const loadCashfreeSDK = async () => {
      try {
        const { load } = await import('@cashfreepayments/cashfree-js');
        const cashfree = await load({
          mode: 'production'
        });
        window.Cashfree = cashfree;
        setCashfreeLoaded(true);
        console.log('✅ Cashfree SDK loaded successfully');
      } catch (error) {
        console.error('❌ Failed to load Cashfree SDK:', error);
      }
    };

    loadCashfreeSDK();
  }, []);

  const proceedToPayment = async () => {
    if (!paymentSessionId.trim()) {
      alert('Please enter a payment session ID!');
      return;
    }

    if (!cashfreeLoaded || !window.Cashfree) {
      alert('Cashfree SDK not loaded yet. Please wait and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const checkoutOptions = {
        paymentSessionId: paymentSessionId.trim(),
        redirectTarget: '_self',
      };

      console.log('🚀 Starting Cashfree checkout with session:', paymentSessionId);
      await window.Cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error('❌ Payment checkout failed:', error);
      alert('Failed to open payment page. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TestTube className="w-8 h-8 text-green-400" />
            <h1 className="text-4xl font-bold">Direct Payment Test</h1>
          </div>
          <p className="text-white/70">
            Test payment directly with session ID (no backend needed)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-400" />
            Payment Session Test
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Payment Session ID
              </label>
              <textarea
                value={paymentSessionId}
                onChange={(e) => setPaymentSessionId(e.target.value)}
                className="w-full p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors font-mono text-sm"
                placeholder="Enter your payment session ID here..."
                rows={3}
              />
            </div>

            <div className={`p-4 rounded-lg border ${
              cashfreeLoaded 
                ? 'bg-green-500/10 border-green-400/30 text-green-300' 
                : 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300'
            }`}>
              <div className="font-semibold mb-1">
                Cashfree SDK Status: {cashfreeLoaded ? 'Ready ✅' : 'Loading...'}
              </div>
              <div className="text-sm opacity-80">
                {cashfreeLoaded ? 'You can proceed to payment' : 'Please wait for SDK to load'}
              </div>
            </div>

            <button
              onClick={proceedToPayment}
              disabled={!cashfreeLoaded || isLoading || !paymentSessionId.trim()}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold text-white hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? 'Opening Payment...' : '💳 Pay Now'}
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <h3 className="text-blue-300 font-semibold mb-2">How it works:</h3>
            <div className="text-sm text-blue-200 space-y-1">
              <div>1. Session ID is already filled from your test</div>
              <div>2. Click "Pay Now" to open Cashfree checkout</div>
              <div>3. Complete payment with test cards</div>
              <div>4. You'll be redirected back after payment</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg">
            <h3 className="text-purple-300 font-semibold mb-2">Test Card Details:</h3>
            <div className="text-sm text-purple-200 space-y-1 font-mono">
              <div>Card: 4111 1111 1111 1111</div>
              <div>CVV: 123</div>
              <div>Expiry: Any future date</div>
              <div>OTP: 123456</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
