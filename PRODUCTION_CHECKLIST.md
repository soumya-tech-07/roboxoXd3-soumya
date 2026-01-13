# Production Readiness Checklist

## ✅ Environment Variables

Ensure these are set in your production environment (`.env.local` or hosting platform):

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (if needed)

# Razorpay (Required)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_S3GjnL0SME2AIG
RAZORPAY_KEY_ID=rzp_live_S3GjnL0SME2AIG
RAZORPAY_KEY_SECRET=NDfRkfcacAvD38kAD5dqcPh1
```

## ✅ Database Setup

### Required Supabase Functions:
- `create_order_from_cart` - Creates orders from cart items
- `get_cart_with_products` - Fetches cart with product details
- `generate_order_number` - Generates unique order numbers

### Required Tables:
- `orders` - Order information
- `order_items` - Order line items
- `cart_items` - Shopping cart items
- `products` - Product catalog
- `addresses` - User addresses
- `profiles` - User profiles
- `wishlist_items` - Wishlist items

### Order Table Fields:
- `id` (string, primary key)
- `order_number` (string)
- `user_id` (string)
- `status` (string) - pending, confirmed, processing, shipped, delivered, cancelled
- `payment_method` (string) - COD, ONLINE
- `payment_status` (string) - pending, paid, failed
- `shipping_address` (JSON)
- `billing_address` (JSON)
- `subtotal` (number)
- `tax` (number)
- `shipping_cost` (number)
- `total` (number)
- `notes` (string) - Stores Razorpay payment IDs
- `created_at` (timestamp)
- `updated_at` (timestamp)

**Note:** Payment information (Razorpay Payment ID and Order ID) is stored in the `notes` field as the database schema doesn't include separate `payment_id` or `razorpay_order_id` columns.

## ✅ Razorpay Integration

### API Routes Created:
1. `/api/razorpay/create-order` - Creates Razorpay orders
2. `/api/razorpay/verify-payment` - Verifies payment signatures
3. `/api/razorpay/check-config` - Development only, checks config

### Payment Flow:
1. User selects "Online Payment"
2. Razorpay script loads dynamically
3. User clicks "Place Order"
4. Razorpay order is created via API
5. Razorpay checkout modal opens
6. User completes payment
7. Payment is verified on server
8. Order is created in database ONLY after successful payment
9. Cart is cleared
10. User redirected to order confirmation

### Security:
- ✅ Payment verification happens on server
- ✅ Signature verification using HMAC SHA256
- ✅ Payment details stored securely
- ✅ Failed payments don't create orders

## ✅ Features Implemented

### Checkout Flow:
- ✅ Multi-step checkout (Address → Payment → Review)
- ✅ Saved addresses support
- ✅ Address validation
- ✅ COD and Online payment options
- ✅ Order summary with tax and shipping
- ✅ Free shipping threshold (₹2999)

### Payment Methods:
- ✅ Cash on Delivery (COD)
- ✅ Online Payment via Razorpay
  - Credit/Debit Cards
  - UPI
  - Net Banking
  - Wallets

### Order Management:
- ✅ Order creation from cart
- ✅ Order status tracking
- ✅ Payment status tracking
- ✅ Order history page
- ✅ Order confirmation page
- ✅ Order details view

### Error Handling:
- ✅ Payment cancellation handling
- ✅ Payment failure handling
- ✅ Network error handling
- ✅ Validation errors
- ✅ User-friendly error messages

## ⚠️ Pre-Launch Testing

### Test Scenarios:
1. **COD Orders:**
   - [ ] Create COD order successfully
   - [ ] Verify order appears in "My Orders"
   - [ ] Check order status is "Pending"
   - [ ] Verify payment method shows "Pay on Delivery"

2. **Online Payment:**
   - [ ] Create Razorpay order successfully
   - [ ] Complete payment successfully
   - [ ] Verify order is created after payment
   - [ ] Check payment status is "Paid"
   - [ ] Verify order appears in "My Orders"
   - [ ] Test payment cancellation (should not create order)
   - [ ] Test payment failure (should not create order)

3. **Edge Cases:**
   - [ ] Empty cart handling
   - [ ] Invalid address handling
   - [ ] Network failures
   - [ ] Razorpay script loading failures
   - [ ] Multiple simultaneous orders

### Browser Testing:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Checklist

- ✅ Environment variables not exposed to client (except NEXT_PUBLIC_*)
- ✅ Payment verification on server
- ✅ Signature verification implemented
- ✅ No sensitive data in client-side code
- ✅ Error messages don't expose sensitive information

## 📝 Notes

1. **Payment Information Storage:**
   - Razorpay Payment ID and Order ID are stored in the `notes` field of the orders table
   - This is because the database schema doesn't include separate columns for these fields
   - If you want to add these columns later, you can migrate the data from notes

2. **Order Status Flow:**
   - COD: pending → confirmed → processing → shipped → delivered
   - Online: confirmed (paid) → processing → shipped → delivered

3. **Payment Status:**
   - COD: Always "pending" until delivery
   - Online: "paid" immediately after successful payment

## 🚀 Deployment Steps

1. Set all environment variables in your hosting platform
2. Build the application: `npm run build`
3. Test the build locally: `npm start`
4. Deploy to production
5. Verify environment variables are loaded
6. Test payment flow with small amount
7. Monitor error logs
8. Test all critical user flows

## 📞 Support

If you encounter issues:
1. Check server logs for errors
2. Verify environment variables are set correctly
3. Check Razorpay dashboard for payment status
4. Verify Supabase connection and permissions
5. Test API routes directly

