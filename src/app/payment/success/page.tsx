'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ArrowLeft, Download } from 'lucide-react';
import Logo from '../../../../components/Logo';

// Client component that uses useSearchParams
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    
    if (!orderId) {
      setPaymentStatus('failed');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/payment/verify?orderId=${orderId}`);
        const result = await response.json();
        
        if (result.success) {
          setOrderDetails(result.data);
          setPaymentStatus(result.data.orderStatus.toLowerCase());
        } else {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setPaymentStatus('failed');
      }
    };

    verifyPayment();
  }, [searchParams]);

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="w-16 h-16 text-green-400" />;
      case 'failed':
        return <XCircle className="w-16 h-16 text-red-400" />;
      case 'pending':
        return <Clock className="w-16 h-16 text-yellow-400" />;
      default:
        return <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return {
          title: 'Payment Successful!',
          message: 'Your registration has been confirmed. You will receive a confirmation email shortly.',
          color: 'text-green-400'
        };
      case 'failed':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again or contact support.',
          color: 'text-red-400'
        };
      case 'pending':
        return {
          title: 'Payment Pending',
          message: 'Your payment is being processed. Please wait for confirmation.',
          color: 'text-yellow-400'
        };
      default:
        return {
          title: 'Verifying Payment...',
          message: 'Please wait while we verify your payment status.',
          color: 'text-purple-400'
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
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

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/checkout')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Logo className="block" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center min-h-[70vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              {getStatusIcon()}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-3xl font-bold mb-4 ${statusInfo.color}`}
            >
              {statusInfo.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white/70 mb-8"
            >
              {statusInfo.message}
            </motion.p>

            {orderDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/5 border border-white/20 rounded-lg p-6 mb-8"
              >
                <h3 className="text-lg font-semibold mb-4 text-white">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Order ID:</span>
                    <span className="text-white font-mono">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Status:</span>
                    <span className={`font-semibold ${statusInfo.color}`}>
                      {orderDetails.orderStatus}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="space-y-4"
            >
              {paymentStatus === 'success' && (
                <button
                  onClick={() => {/* Add download ticket functionality */}}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-white hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Tickets
                </button>
              )}
              
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 bg-white/10 border border-white/20 rounded-xl font-bold text-white hover:bg-white/20 transition-all"
              >
                Back to Home
              </button>

              {paymentStatus === 'failed' && (
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-white hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  Try Again
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/10 via-transparent to-cyan-900/10" />
      
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-purple-400 mb-2">Loading Payment Status...</h1>
        <p className="text-white/70">Please wait while we verify your payment</p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
