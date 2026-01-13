import Razorpay from 'razorpay';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

// Initialize Razorpay instance with error handling
let razorpay;

try {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('Razorpay credentials missing in verify-payment route');
  } else {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
} catch (error) {
  console.error('Error initializing Razorpay in verify-payment:', error);
}

export async function POST(request) {
  // Check if Razorpay is initialized
  if (!razorpay) {
    return NextResponse.json(
      { error: 'Payment gateway not configured', verified: false },
      { status: 500 }
    );
  }
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify the signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    const isSignatureValid = generated_signature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature', verified: false },
        { status: 400 }
      );
    }

    // Fetch payment details from Razorpay
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      
      return NextResponse.json({
        verified: true,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount: payment.amount / 100, // Convert from paise to rupees
        status: payment.status,
        method: payment.method,
      });
    } catch (error) {
      console.error('Error fetching payment from Razorpay:', error);
      return NextResponse.json(
        { error: 'Failed to verify payment', verified: false },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment', verified: false },
      { status: 500 }
    );
  }
}

