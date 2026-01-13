import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

// Initialize Razorpay instance
let razorpay;

try {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error('Razorpay credentials missing:', {
      hasKeyId: !!keyId,
      hasKeySecret: !!keySecret,
    });
  } else {
    razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
} catch (error) {
  console.error('Error initializing Razorpay:', error);
}

export async function POST(request) {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      console.error('Razorpay not initialized. Check environment variables.');
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const { amount, currency = 'INR', receipt, notes } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: 'Minimum amount is ₹1.00' },
        { status: 400 }
      );
    }

    // Ensure receipt is max 40 characters (Razorpay requirement)
    const generateReceipt = () => {
      if (receipt && receipt.length <= 40) {
        return receipt;
      }
      // Generate a short receipt if not provided or too long
      const timestamp = Date.now().toString().slice(-10);
      return `RLOUVE_${timestamp}`.substring(0, 40);
    };

    const options = {
      amount: amountInPaise,
      currency,
      receipt: generateReceipt(),
      notes: notes || {},
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('Creating Razorpay order with options:', {
        ...options,
        notes: options.notes,
      });
    }

    const order = await razorpay.orders.create(options);

    if (process.env.NODE_ENV === 'development') {
      console.log('Razorpay order created successfully:', order.id);
    }

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', {
      message: error.message,
      error: error.error,
      description: error.error?.description,
      code: error.error?.code,
      stack: error.stack,
    });

    // Return more detailed error message
    const errorMessage = error.error?.description || error.message || 'Failed to create order';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? {
          code: error.error?.code,
          description: error.error?.description,
        } : undefined,
      },
      { status: 500 }
    );
  }
}

