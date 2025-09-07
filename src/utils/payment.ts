interface CouponCode {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minAmount?: number;
  maxDiscount?: number;
  validUntil?: string;
  usageLimit?: number;
  usageCount?: number;
  isActive: boolean;
}

// Sample coupon codes - In production, this would come from a database
const COUPON_CODES: CouponCode[] = [
  {
    code: 'EARLYBIRD',
    discountType: 'percentage',
    discountValue: 15,
    minAmount: 100,
    maxDiscount: 50,
    validUntil: '2024-12-20T23:59:59Z',
    usageLimit: 100,
    usageCount: 0,
    isActive: true
  },
  {
    code: 'STUDENT50',
    discountType: 'fixed',
    discountValue: 50,
    minAmount: 150,
    validUntil: '2025-01-05T23:59:59Z',
    usageLimit: 200,
    usageCount: 0,
    isActive: true
  },
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minAmount: 50,
    maxDiscount: 30,
    isActive: true
  }
];

export interface CouponValidationResult {
  isValid: boolean;
  discountAmount: number;
  finalAmount: number;
  errorMessage?: string;
  couponDetails?: CouponCode;
}

export function validateCoupon(
  couponCode: string, 
  orderAmount: number
): CouponValidationResult {
  const coupon = COUPON_CODES.find(
    c => c.code.toLowerCase() === couponCode.toLowerCase() && c.isActive
  );

  if (!coupon) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: orderAmount,
      errorMessage: 'Invalid coupon code'
    };
  }

  // Check if coupon is expired
  if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: orderAmount,
      errorMessage: 'Coupon has expired'
    };
  }

  // Check minimum amount
  if (coupon.minAmount && orderAmount < coupon.minAmount) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: orderAmount,
      errorMessage: `Minimum order amount is ₹${coupon.minAmount}`
    };
  }

  // Check usage limit
  if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
    return {
      isValid: false,
      discountAmount: 0,
      finalAmount: orderAmount,
      errorMessage: 'Coupon usage limit exceeded'
    };
  }

  // Calculate discount
  let discountAmount = 0;
  
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderAmount * coupon.discountValue) / 100;
    
    // Apply maximum discount limit if specified
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  // Ensure discount doesn't exceed order amount
  discountAmount = Math.min(discountAmount, orderAmount);

  const finalAmount = orderAmount - discountAmount;

  return {
    isValid: true,
    discountAmount,
    finalAmount,
    couponDetails: coupon
  };
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function generateOrderId(): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substr(2, 9);
  return `sabrang_${timestamp}_${randomString}`;
}

export function getPaymentMethods(): string[] {
  return ['cc', 'dc', 'upi', 'nb', 'wallet', 'emi'];
}

export function calculateProcessingFee(amount: number): number {
  // Calculate processing fee (example: 2% + ₹5)
  const percentageFee = amount * 0.02;
  const fixedFee = 5;
  return percentageFee + fixedFee;
}

export function getReturnUrl(orderId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return `${baseUrl}/payment/success?order_id=${orderId}`;
}
