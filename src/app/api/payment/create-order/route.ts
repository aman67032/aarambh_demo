import { NextRequest, NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from 'cashfree-pg';
import { validateCoupon, generateOrderId, getReturnUrl } from '../../../../utils/payment';

// Initialize Cashfree
const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION, // Change to CFEnvironment.SANDBOX for testing
  process.env.CASHFREE_APP_ID!,
  process.env.CASHFREE_SECRET_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderAmount, 
      customerDetails, 
      selectedEvents, 
      selectedCombo,
      couponCode 
    } = body;

    // Generate unique order ID
    const orderId = generateOrderId();

    // Calculate final amount with coupon discount
    let finalAmount = orderAmount;
    let discountAmount = 0;
    
    // Apply coupon discount if provided
    if (couponCode) {
      const couponResult = validateCoupon(couponCode, orderAmount);
      if (couponResult.isValid) {
        finalAmount = couponResult.finalAmount;
        discountAmount = couponResult.discountAmount;
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: couponResult.errorMessage || 'Invalid coupon code' 
          },
          { status: 400 }
        );
      }
    }

    // Create order request
    const orderRequest = {
      order_amount: finalAmount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: customerDetails.customerId || `customer_${Date.now()}`,
        customer_phone: customerDetails.phone,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email
      },
      order_meta: {
        return_url: getReturnUrl(orderId),
        payment_methods: "cc,dc,upi,nb,wallet,emi"
      }
    };

    // Create order with Cashfree
    const response = await cashfree.PGCreateOrder(orderRequest);
    
    console.log('Order created successfully:', response.data);

    return NextResponse.json({
      success: true,
      data: {
        orderId: response.data.order_id,
        paymentSessionId: response.data.payment_session_id,
        orderAmount: finalAmount,
        originalAmount: orderAmount,
        discountAmount
      }
    });

  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.response?.data?.message || 'Failed to create order' 
      },
      { status: 500 }
    );
  }
}
