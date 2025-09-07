# Cashfree Payment Gateway Integration

This project integrates Cashfree Payment Gateway for handling payments in the Sabrang event management system.

## Setup Instructions

### 1. Install Dependencies

The required dependencies have already been installed:
- `@cashfreepayments/cashfree-js` - Client-side SDK
- `cashfree-pg` - Server-side SDK

### 2. Environment Variables

Add your Cashfree credentials to `.env.local`:

```bash
# Cashfree Payment Gateway Configuration
CASHFREE_APP_ID=your-actual-app-id
CASHFREE_SECRET_KEY=your-actual-secret-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**To get your credentials:**
1. Go to [Cashfree Dashboard](https://merchant.cashfree.com/)
2. Navigate to Developers > API Keys
3. Copy your App ID and Secret Key

### 3. Environment Configuration

For **testing**: Use `CFEnvironment.SANDBOX` in API routes
For **production**: Use `CFEnvironment.PRODUCTION` in API routes

Update the environment in:
- `/src/app/api/payment/create-order/route.ts`
- `/src/app/api/payment/verify/route.ts`

### 4. Payment Flow

#### Client Side:
1. User selects events/combos and clicks checkout
2. Payment form opens with customer details
3. On form submission, order is created via API
4. Payment checkout is initiated with Cashfree SDK
5. User is redirected to success/failure page

#### Server Side:
1. **Create Order API** (`/api/payment/create-order`)
   - Validates customer details
   - Applies coupon discounts
   - Creates order with Cashfree
   - Returns payment session ID

2. **Verify Payment API** (`/api/payment/verify`)
   - Checks payment status
   - Returns order status and payment details

### 5. Features Implemented

- ✅ **Event Selection**: Choose individual events or combo packages
- ✅ **Time Conflict Detection**: Prevents overlapping event bookings
- ✅ **Quantity Management**: Multiple tickets per event
- ✅ **Coupon System**: Percentage and fixed discounts
- ✅ **Real-time Validation**: Coupon validation with feedback
- ✅ **Payment Integration**: Full Cashfree integration
- ✅ **Order Management**: Status tracking and verification
- ✅ **Admin Dashboard**: Payment monitoring and export
- ✅ **Responsive Design**: Mobile-friendly interface

### 6. Coupon Codes (Pre-configured)

- `EARLYBIRD`: 15% discount (min ₹100, max ₹50 discount)
- `STUDENT50`: ₹50 fixed discount (min ₹150)
- `WELCOME10`: 10% discount (min ₹50, max ₹30 discount)

### 7. API Endpoints

- `POST /api/payment/create-order`: Create new payment order
- `GET /api/payment/verify?orderId=<id>`: Verify payment status

### 8. Pages

- `/checkout`: Main checkout page with event selection
- `/payment/success`: Payment result page
- `/admin/payments`: Admin dashboard for payment monitoring

### 9. Testing

1. Start the development server:
```bash
npm run dev
```

2. Navigate to `/checkout` to test the payment flow

3. Use Cashfree's test cards for sandbox testing:
   - **Success**: 4111 1111 1111 1111
   - **Failure**: 4012 0010 3714 1112

### 10. Production Deployment

1. Update environment variables with production credentials
2. Change `CFEnvironment.SANDBOX` to `CFEnvironment.PRODUCTION`
3. Update `NEXT_PUBLIC_BASE_URL` to your domain
4. Test thoroughly before going live

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── payment/
│   │       ├── create-order/route.ts
│   │       └── verify/route.ts
│   ├── checkout/page.tsx
│   ├── payment/success/page.tsx
│   └── admin/payments/page.tsx
├── components/
│   └── payment/
│       └── PaymentForm.tsx
├── hooks/
│   └── usePayment.ts
├── types/
│   └── cashfree.d.ts
└── utils/
    └── payment.ts
```

## Security Notes

- Never expose secret keys in client-side code
- Always validate payments on the server side
- Use HTTPS in production
- Implement proper error handling
- Store sensitive data securely

## Support

For Cashfree integration issues, refer to:
- [Cashfree Documentation](https://docs.cashfree.com/)
- [Cashfree Support](https://www.cashfree.com/support/)

For project-specific issues, check the console logs and error messages.
