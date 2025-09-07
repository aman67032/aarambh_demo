'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, TestTube } from 'lucide-react';

// Type declaration for Cashfree SDK
declare module '@cashfreepayments/cashfree-js' {
  interface CashfreeConfig {
    mode: 'production' | 'sandbox';
  }
  
  export function load(config: CashfreeConfig): Promise<any>;
}

// Declare global for Cashfree
declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function TestPaymentPage() {
  const [paymentSessionId, setPaymentSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [cashfreeLoaded, setCashfreeLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

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

  // Check for return URL params on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    const status = urlParams.get('status');
    
    if (orderId) {
      setPaymentStatus(status || 'completed');
      setResult({
        type: 'payment-redirect',
        success: status === 'success' || status === 'SUCCESS',
        data: {
          orderId,
          status,
          message: `Payment ${status === 'success' || status === 'SUCCESS' ? 'completed successfully' : 'failed or was cancelled'}`
        },
        status: status === 'success' || status === 'SUCCESS' ? 'success' : 'failed'
      });
    }
  }, []);

  const handleSessionIdChange = (value: string) => {
    setPaymentSessionId(value);
  };

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
    setResult(null);

    try {
      const checkoutOptions = {
        paymentSessionId: paymentSessionId.trim(),
        redirectTarget: '_self',
      };

      console.log('🚀 Starting Cashfree checkout with session:', paymentSessionId);
      setResult({
        type: 'payment-initiated',
        success: true,
        data: {
          paymentSessionId: paymentSessionId.trim(),
          message: 'Payment checkout initiated successfully!'
        },
        status: 'initiated'
      });

      await window.Cashfree.checkout(checkoutOptions);
    } catch (error: any) {
      console.error('❌ Payment checkout failed:', error);
      setResult({
        type: 'payment-failed',
        success: false,
        data: {
          error: error.message || 'Payment checkout failed',
          paymentSessionId: paymentSessionId.trim()
        },
        status: 'failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateSessionId = () => {
    const sessionId = paymentSessionId.trim();
    if (!sessionId) return false;
    
    // Basic validation for Cashfree session ID format
    if (sessionId.length < 10) {
      setResult({
        type: 'validation',
        success: false,
        data: { error: 'Session ID appears to be too short' },
        status: 'invalid'
      });
      return false;
    }

    setResult({
      type: 'validation',
      success: true,
      data: { 
        message: 'Session ID format looks valid!',
        sessionId 
      },
      status: 'valid'
    });
    return true;
  };

  const clearResults = () => {
    setResult(null);
    setPaymentStatus(null);
  };

  

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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
            Test Cashfree payments directly with a payment session ID (no backend required)
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-400" />
              Payment Session ID
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Enter Payment Session ID
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <textarea
                    value={paymentSessionId}
                    onChange={(e) => handleSessionIdChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400 transition-colors min-h-[100px] resize-vertical"
                    placeholder="Paste your payment session ID here..."
                  />
                </div>
                <p className="text-xs text-white/50 mt-2">
                  This should be the payment_session_id returned from your backend's create order API
                </p>
              </div>
            </div>

            {/* SDK Status */}
            <div className={`mt-4 p-3 rounded-lg border ${
              cashfreeLoaded 
                ? 'bg-green-500/10 border-green-400/30 text-green-300' 
                : 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300'
            }`}>
              <div className="text-sm font-medium">
                Cashfree SDK: {cashfreeLoaded ? '✅ Loaded' : '⏳ Loading...'}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mt-6">
              <button
                onClick={validateSessionId}
                disabled={isLoading || !paymentSessionId.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-white hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Validate Session ID
              </button>

              <button
                onClick={proceedToPayment}
                disabled={isLoading || !cashfreeLoaded || !paymentSessionId.trim()}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-bold text-white hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : '💳 Start Payment'}
              </button>

              <button
                onClick={clearResults}
                className="w-full py-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg font-bold text-white hover:from-gray-600 hover:to-gray-700 transition-all"
              >
                Clear Results
              </button>
            </div>

            {/* How to get session ID */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <h3 className="text-blue-300 font-semibold mb-2">How to get a Payment Session ID:</h3>
              <div className="text-sm text-blue-200 space-y-2">
                <div>1. Create an order using Cashfree's Create Order API on your backend</div>
                <div>2. The API response will contain a "payment_session_id"</div>
                <div>3. Copy that ID and paste it above</div>
                <div>4. Click "Start Payment" to open the payment gateway</div>
              </div>
            </div>

            {/* Environment Info */}
            <div className="mt-4 p-4 bg-black/30 rounded-lg">
              <h3 className="text-sm font-semibold text-white/80 mb-2">Environment Info:</h3>
              <div className="text-xs text-white/60 space-y-1">
                <div>SDK Mode: Production</div>
                <div>Environment: {process.env.NODE_ENV || 'production'}</div>
                <div>Redirect Target: Current Tab (_self)</div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">Payment Results</h2>

            {paymentStatus && (
              <div className={`mb-4 p-4 rounded-lg border ${
                paymentStatus === 'success' || paymentStatus === 'SUCCESS'
                  ? 'bg-green-500/10 border-green-400/30 text-green-300' 
                  : 'bg-orange-500/10 border-orange-400/30 text-orange-300'
              }`}>
                <div className="font-semibold mb-2">
                  PAYMENT REDIRECT DETECTED
                </div>
                <div className="text-sm opacity-80">
                  Status: {paymentStatus}
                </div>
              </div>
            )}

            {result ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  result.success 
                    ? 'bg-green-500/10 border-green-400/30 text-green-300' 
                    : 'bg-red-500/10 border-red-400/30 text-red-300'
                }`}>
                  <div className="font-semibold mb-2">
                    {result.type.toUpperCase().replace('-', ' ')} - {result.success ? 'SUCCESS' : 'FAILED'}
                  </div>
                  <div className="text-sm opacity-80">
                    Status: {result.status}
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Response Data:</h3>
                  <pre className="text-sm text-white/70 overflow-auto max-h-96">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center text-white/50 py-8">
                <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enter a payment session ID and start testing</p>
              </div>
            )}

            {/* Payment Flow Guide */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <h3 className="text-blue-300 font-semibold mb-2">Payment Flow:</h3>
              <div className="text-sm text-blue-200 space-y-2">
                <div>1. Enter a valid payment session ID</div>
                <div>2. Validate the session ID format</div>
                <div>3. Click "Start Payment" to launch Cashfree</div>
                <div>4. Complete payment in the popup/redirect</div>
                <div>5. Check console for detailed logs</div>
              </div>
            </div>

            {/* Payment Status Guide */}
            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-400/30 rounded-lg">
              <h3 className="text-purple-300 font-semibold mb-2">After Payment:</h3>
              <div className="text-sm text-purple-200 space-y-1">
                <div>• SUCCESS: Payment completed successfully</div>
                <div>• FAILED: Payment failed or was declined</div>
                <div>• PENDING: Payment is being processed</div>
                <div>• CANCELLED: User cancelled the payment</div>
              </div>
            </div>

            {/* Sample Session ID */}
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
              <h3 className="text-yellow-300 font-semibold mb-2">Sample Session ID Format:</h3>
              <div className="text-sm text-yellow-200 font-mono bg-black/30 p-2 rounded">
                session_abc123def456...
              </div>
              <div className="text-xs text-yellow-200 mt-1">
                Actual session IDs are much longer and contain alphanumeric characters
              </div>
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-6"
        >
          <h3 className="text-yellow-300 font-semibold mb-3">How to Use This Tool:</h3>
          <div className="text-sm text-yellow-200 space-y-2">
            <div><strong>Step 1:</strong> Get a payment session ID from your backend (using Cashfree's Create Order API)</div>
            <div><strong>Step 2:</strong> Paste the session ID in the input field above</div>
            <div><strong>Step 3:</strong> Click "Validate Session ID" to check the format</div>
            <div><strong>Step 4:</strong> Click "Start Payment" to open the Cashfree payment gateway</div>
            <div><strong>Step 5:</strong> Complete the payment process in the gateway</div>
            <div><strong>Step 6:</strong> You'll be redirected back here with the payment result</div>
          </div>
          
          <div className="mt-4 p-3 bg-black/30 rounded-lg">
            <h4 className="text-yellow-200 font-medium mb-2">Backend Create Order Example:</h4>
            <pre className="text-xs text-yellow-100 overflow-x-auto">
{`const order = await cashfree.PGCreateOrder({
  order_amount: 100.00,
  order_currency: "INR", 
  order_id: "order_" + Date.now(),
  customer_details: {
    customer_id: "customer_123",
    customer_phone: "9876543210",
    customer_name: "Test User",
    customer_email: "test@example.com"
  }
});
// Use: order.payment_session_id`}</pre>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
