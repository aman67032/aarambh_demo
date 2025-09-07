import { NextRequest, NextResponse } from 'next/server';
import { Cashfree, CFEnvironment } from 'cashfree-pg';

// Initialize Cashfree
const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION, // Change to CFEnvironment.SANDBOX for testing
  process.env.CASHFREE_APP_ID!,
  process.env.CASHFREE_SECRET_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order payments
    const response = await cashfree.PGOrderFetchPayments(orderId);
    const payments = response.data;

    let orderStatus = 'FAILED';
    
    // Analyze payment status
    if (payments.filter((payment: any) => payment.payment_status === 'SUCCESS').length > 0) {
      orderStatus = 'SUCCESS';
    } else if (payments.filter((payment: any) => payment.payment_status === 'PENDING').length > 0) {
      orderStatus = 'PENDING';
    } else {
      orderStatus = 'FAILED';
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        orderStatus,
        payments
      }
    });

  } catch (error: any) {
    console.error('Error fetching payment status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.response?.data?.message || 'Failed to fetch payment status' 
      },
      { status: 500 }
    );
  }
}
