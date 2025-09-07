# Cashfree Backend Integration Example

This file shows how to create the backend API that generates payment session IDs for use with the test payment page.

## Server-side Setup (Node.js/Express)

### 1. Install Dependencies
```bash
npm install cashfree-pg
```

### 2. Initialize Cashfree SDK
```javascript
import { Cashfree, CFEnvironment } from "cashfree-pg";

// Initialize Cashfree
const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION, // or CFEnvironment.SANDBOX for testing
  "your-app-id",           // Your Cashfree App ID
  "your-secret-key"        // Your Cashfree Secret Key
);
```

### 3. Create Order API Endpoint
```javascript
// POST /api/create-order
app.post('/api/create-order', async (req, res) => {
  try {
    const { orderAmount, customerDetails } = req.body;
    
    const request = {
      "order_amount": orderAmount,
      "order_currency": "INR",
      "order_id": "order_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
      "customer_details": {
        "customer_id": customerDetails.email || "guest_" + Date.now(),
        "customer_phone": customerDetails.phone,
        "customer_name": customerDetails.name,
        "customer_email": customerDetails.email
      },
      "order_meta": {
        "return_url": `${process.env.FRONTEND_URL}/test-payment?order_id={order_id}`,
        "payment_methods": "cc,dc,upi,nb,wallet"
      }
    };

    const response = await cashfree.PGCreateOrder(request);
    
    if (response.data) {
      res.json({
        success: true,
        data: {
          orderId: response.data.order_id,
          paymentSessionId: response.data.payment_session_id,
          orderAmount: response.data.order_amount
        }
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Failed to create order'
      });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
```

### 4. Environment Variables (.env)
```
CASHFREE_APP_ID=your_app_id_here
CASHFREE_SECRET_KEY=your_secret_key_here
FRONTEND_URL=http://localhost:3000
```

## How to Get Payment Session ID for Testing

### Option 1: Use your backend API
1. Start your backend server
2. Make a POST request to `/api/create-order` with:
```json
{
  "orderAmount": 100,
  "customerDetails": {
    "name": "Test User",
    "email": "test@example.com", 
    "phone": "9876543210"
  }
}
```
3. Copy the `payment_session_id` from the response
4. Paste it in the test payment page

### Option 2: Use Cashfree Dashboard
1. Go to Cashfree Dashboard
2. Navigate to Test Data > Create Test Order
3. Fill the order details
4. Get the payment session ID from the response

### Option 3: Use Postman/cURL
```bash
curl -X POST https://api.cashfree.com/pg/orders \
  -H "Content-Type: application/json" \
  -H "x-api-version: 2023-08-01" \
  -H "x-client-id: YOUR_APP_ID" \
  -H "x-client-secret: YOUR_SECRET_KEY" \
  -d '{
    "order_amount": 100,
    "order_currency": "INR",
    "order_id": "order_test_123",
    "customer_details": {
      "customer_id": "test_customer",
      "customer_phone": "9876543210",
      "customer_name": "Test User",
      "customer_email": "test@example.com"
    }
  }'
```

## Payment Status Handling

After payment completion, user will be redirected to your return_url with order_id parameter:
- `your-site.com/test-payment?order_id=order_123&status=success`
- `your-site.com/test-payment?order_id=order_123&status=failed`

The test payment page automatically detects these parameters and shows the payment result.

## Sample Response from Create Order API
```json
{
  "success": true,
  "data": {
    "orderId": "order_1234567890",
    "paymentSessionId": "session_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
    "orderAmount": 100
  }
}
```

Copy the `paymentSessionId` value and use it in the test payment page.
