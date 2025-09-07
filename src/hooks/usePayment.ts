import { useState, useEffect } from 'react';
import { load } from '@cashfreepayments/cashfree-js';

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  customerId?: string;
}

interface PaymentOptions {
  orderAmount: number;
  customerDetails: CustomerDetails;
  selectedEvents: number[];
  selectedCombo?: string;
  couponCode?: string;
}

interface PaymentResponse {
  success: boolean;
  data?: {
    orderId: string;
    paymentSessionId: string;
    orderAmount: number;
  };
  error?: string;
}

export const usePayment = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cashfree, setCashfree] = useState<any>(null);

  // Initialize Cashfree SDK
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const cf = await load({
          mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
        });
        setCashfree(cf);
      } catch (error) {
        console.error('Failed to initialize Cashfree SDK:', error);
      }
    };

    initializeSDK();
  }, []);

  const createOrder = async (options: PaymentOptions): Promise<PaymentResponse> => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(options),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create order');
      }

      return result;
    } catch (error: any) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error.message || 'Failed to create order'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const processPayment = async (paymentSessionId: string): Promise<void> => {
    if (!cashfree) {
      throw new Error('Cashfree SDK not initialized');
    }

    const checkoutOptions = {
      paymentSessionId,
      redirectTarget: '_self',
    };

    try {
      await cashfree.checkout(checkoutOptions);
    } catch (error) {
      console.error('Payment checkout error:', error);
      throw error;
    }
  };

  const verifyPayment = async (orderId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/verify?orderId=${orderId}`, {
        credentials: 'include'
      });
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to verify payment');
      }

      return result.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const validatePromoCode = async (promoCode: string, orderAmount: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/validate-promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ promoCode, orderAmount }),
      });

      const result = await response.json();
      
      return {
        success: result.success,
        data: result.data,
        error: result.error
      };
    } catch (error: any) {
      console.error('Error validating promo code:', error);
      return {
        success: false,
        error: error.message || 'Failed to validate promo code'
      };
    }
  };

  return {
    isLoading,
    createOrder,
    processPayment,
    verifyPayment,
    validatePromoCode,
    isSDKReady: !!cashfree
  };
};
