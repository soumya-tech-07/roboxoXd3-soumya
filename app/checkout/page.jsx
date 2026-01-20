'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useToast } from '../context/ToastContext';
import { createClient } from '@/lib/supabase';

const supabase = createClient();

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const { cart, getCartTotal, loading: cartLoading, clearCart } = useCart();
  const { showSuccess, showError } = useToast();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Address form
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD or ONLINE

  // Cart items already have product data from CartContext
  const cartItems = useMemo(() => {
    return cart.filter((item) => item.product); // Filter out any items with missing products
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      if (item.product?.price) {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0);
  }, [cartItems]);

  const shippingCost = cartTotal >= 299 ? 0 : 99;
  const tax = cartTotal * 0.18; // 18% GST
  const total = cartTotal + shippingCost + tax;

  // Redirect to home and open login modal if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      // Small delay to ensure navigation completes, then open login modal
      setTimeout(() => {
        openLogin();
      }, 100);
    }
  }, [isAuthenticated, authLoading, router, openLogin]);

  // Load saved addresses
  useEffect(() => {
    if (isAuthenticated && user) {
      loadAddresses();
      loadProfile();
    }
  }, [isAuthenticated, user]);

  const loadAddresses = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'shipping')
        .order('is_default', { ascending: false });

      if (error) throw error;
      setSavedAddresses(data || []);
      const defaultAddress = data?.find((addr) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setAddress({
          fullName: defaultAddress.full_name,
          phone: defaultAddress.phone,
          addressLine1: defaultAddress.address_line1,
          addressLine2: defaultAddress.address_line2 || '',
          city: defaultAddress.city,
          state: defaultAddress.state,
          postalCode: defaultAddress.postal_code,
          country: defaultAddress.country || 'India',
        });
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const loadProfile = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setAddress((prev) => ({
          ...prev,
          fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim() || prev.fullName,
          phone: data.phone || prev.phone,
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !cartLoading) {
      router.push('/cart');
    }
  }, [cart.length, cartLoading, router]);

  // Load Razorpay script
  useEffect(() => {
    if (paymentMethod === 'ONLINE' && !razorpayLoaded) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
        showError('Failed to load payment gateway. Please refresh the page.');
      };
      document.body.appendChild(script);

      return () => {
        // Cleanup script on unmount
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [paymentMethod, razorpayLoaded, showError]);

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressSelect = (addr) => {
    setSelectedAddressId(addr.id);
    setUseNewAddress(false);
    setAddress({
      fullName: addr.full_name,
      phone: addr.phone,
      addressLine1: addr.address_line1,
      addressLine2: addr.address_line2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postal_code,
      country: addr.country || 'India',
    });
  };

  const validateAddress = () => {
    if (!address.fullName || !address.phone || !address.addressLine1 || 
        !address.city || !address.state || !address.postalCode) {
      showError('Please fill in all required address fields');
      return false;
    }
    if (address.phone.length < 10) {
      showError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateAddress()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRazorpayPayment = async (orderId) => {
    return new Promise((resolve, reject) => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay SDK not loaded'));
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(total * 100), // Convert to paise
        currency: 'INR',
        name: 'Retro Louve',
        description: `Order #${orderId}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment on server
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.verified) {
              resolve(verifyData);
            } else {
              reject(new Error('Payment verification failed'));
            }
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          name: address.fullName,
          email: user.email || '',
          contact: address.phone,
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: function () {
            reject(new Error('Payment cancelled by user'));
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    });
  };

  const createOrderInDatabase = async (paymentId = null, paymentStatus = 'pending') => {
    if (!user) return null;

    // Prepare address data
    const shippingAddress = {
      full_name: address.fullName,
      phone: address.phone,
      address_line1: address.addressLine1,
      address_line2: address.addressLine2,
      city: address.city,
      state: address.state,
      postal_code: address.postalCode,
      country: address.country,
    };

    // Create order using the function
    const { data: orderId, error } = await supabase.rpc('create_order_from_cart', {
      p_user_id: user.id,
      p_shipping_address: shippingAddress,
      p_billing_address: shippingAddress,
      p_payment_method: paymentMethod,
      p_notes: null,
    });

    if (error) throw error;

    // If payment was successful, update order status
    if (paymentId && paymentStatus === 'captured') {
      try {
        await supabase
          .from('orders')
          .update({ 
            status: 'confirmed',
            payment_status: 'paid',
            payment_id: paymentId
          })
          .eq('id', orderId);
      } catch (updateError) {
        console.error('Error updating order status:', updateError);
        // Don't throw - order is already created
      }
    }

    // Save address if new
    if (useNewAddress || !selectedAddressId) {
      try {
        await supabase.from('addresses').insert({
          user_id: user.id,
          type: 'shipping',
          is_default: savedAddresses.length === 0,
          full_name: shippingAddress.full_name,
          phone: shippingAddress.phone,
          address_line1: shippingAddress.address_line1,
          address_line2: shippingAddress.address_line2 || null,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.postal_code,
          country: shippingAddress.country,
        });
      } catch (addrError) {
        console.error('Error saving address:', addrError);
        // Don't fail the order if address save fails
      }
    }

    return orderId;
  };

  const handlePlaceOrder = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (paymentMethod === 'ONLINE') {
        // For online payment, create Razorpay order first
        if (!razorpayLoaded || !window.Razorpay) {
          showError('Payment gateway is loading. Please wait a moment and try again.');
          setLoading(false);
          return;
        }

        // Create Razorpay order
        // Generate a receipt ID that's max 40 characters (Razorpay requirement)
        const timestamp = Date.now().toString().slice(-10); // Last 10 digits of timestamp
        const userIdShort = user.id.substring(0, 8); // First 8 chars of user ID
        const receipt = `RLOUVE_${timestamp}_${userIdShort}`.substring(0, 40); // Max 40 chars
        
        const orderResponse = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: total,
            currency: 'INR',
            receipt: receipt,
            notes: {
              user_id: user.id,
              email: user.email || '',
            },
          }),
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          console.error('Razorpay order creation error:', errorData);
          throw new Error(errorData.error || 'Failed to create payment order');
        }

        const razorpayOrder = await orderResponse.json();

        // Process Razorpay payment first
        try {
          const paymentData = await handleRazorpayPayment(razorpayOrder.id);

          // Only create order in database AFTER successful payment verification
          const dbOrderId = await createOrderInDatabase(
            paymentData.payment_id,
            'captured'
          );

          // Update order with Razorpay order ID
          try {
            await supabase
              .from('orders')
              .update({
                razorpay_order_id: razorpayOrder.id,
              })
              .eq('id', dbOrderId);
          } catch (updateError) {
            console.error('Error updating order with Razorpay order ID:', updateError);
            // Don't throw - order is already created and payment is verified
          }

          // Clear cart after successful payment
          clearCart();

          showSuccess('Payment successful! Order placed.');
          
          // Redirect to order confirmation
          setTimeout(() => {
            router.push(`/order-confirmation/${dbOrderId}`);
          }, 1000);
        } catch (paymentError) {
          console.error('Payment error:', paymentError);
          
          // Don't create order if payment fails - just show error
          if (paymentError.message.includes('cancelled')) {
            showError('Payment was cancelled. No order was created.');
          } else {
            showError(paymentError.message || 'Payment failed. Please try again.');
          }
        }
      } else {
        // For COD, create order directly
        const orderId = await createOrderInDatabase();
        
        // Clear cart after order creation
        clearCart();

        showSuccess('Order placed successfully!');
        
        // Redirect to order confirmation
        setTimeout(() => {
          router.push(`/order-confirmation/${orderId}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      showError(error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-32 lg:pt-40 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            CHECKOUT
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-brand font-medium' : ''}>1. Address</span>
            <span>→</span>
            <span className={step >= 2 ? 'text-brand font-medium' : ''}>2. Payment</span>
            <span>→</span>
            <span className={step >= 3 ? 'text-brand font-medium' : ''}>3. Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-wide uppercase">
                  SHIPPING ADDRESS
                </h2>

                {/* Saved Addresses */}
                {savedAddresses.length > 0 && !useNewAddress && (
                  <div className="mb-6 space-y-3">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleAddressSelect(addr)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedAddressId === addr.id
                            ? 'border-brand bg-brand/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{addr.full_name}</p>
                            <p className="text-sm text-gray-600 mt-1">{addr.phone}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {addr.address_line1}
                              {addr.address_line2 && `, ${addr.address_line2}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.city}, {addr.state} {addr.postal_code}
                            </p>
                            <p className="text-sm text-gray-600">{addr.country}</p>
                          </div>
                          {selectedAddressId === addr.id && (
                            <div className="ml-4">
                              <svg className="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setUseNewAddress(true);
                        setSelectedAddressId(null);
                      }}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-brand hover:text-brand transition-colors"
                    >
                      + Add New Address
                    </button>
                  </div>
                )}

                {/* Address Form */}
                {(useNewAddress || savedAddresses.length === 0) && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs tracking-wider text-gray-900 mb-2 uppercase">
                        FULL NAME *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={address.fullName}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs tracking-wider text-gray-900 mb-2 uppercase">
                        PHONE NUMBER *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs tracking-wider text-gray-900 mb-2 uppercase">
                        ADDRESS LINE 1 *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={address.addressLine1}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs tracking-wider text-gray-900 mb-2 uppercase">
                        ADDRESS LINE 2
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={address.addressLine2}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs tracking-wider text-gray-900 mb-2 uppercase">
                          CITY *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={address.city}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs tracking-wider text-gray-900 mb-2 uppercase">
                          STATE *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={address.state}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs tracking-wider text-gray-900 mb-2 uppercase">
                          POSTAL CODE *
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={address.postalCode}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs tracking-wider text-gray-900 mb-2 uppercase">
                          COUNTRY *
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={address.country}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors bg-gray-50"
                          required
                          readOnly
                        />
                      </div>
                    </div>

                    {savedAddresses.length > 0 && (
                      <button
                        onClick={() => {
                          setUseNewAddress(false);
                          const defaultAddr = savedAddresses.find((a) => a.is_default);
                          if (defaultAddr) {
                            handleAddressSelect(defaultAddr);
                          }
                        }}
                        className="text-sm text-brand hover:underline"
                      >
                        Use Saved Address
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors cursor-pointer"
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div className="bg-white border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-wide uppercase">
                  PAYMENT METHOD
                </h2>

                <div className="space-y-4">
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'COD'
                        ? 'border-brand bg-brand/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'COD' ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'COD' && (
                            <div className="w-3 h-3 rounded-full bg-brand" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                          <p className="text-sm text-gray-600">Pay when you receive</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === 'ONLINE'
                        ? 'border-brand bg-brand/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === 'ONLINE' ? 'border-brand' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'ONLINE' && (
                            <div className="w-3 h-3 rounded-full bg-brand" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Online Payment</p>
                          <p className="text-sm text-gray-600">Razorpay - Credit/Debit Card, UPI, Net Banking</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 border border-gray-300 text-gray-700 text-sm tracking-wider hover:border-brand hover:text-brand transition-colors cursor-pointer"
                  >
                    BACK
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors cursor-pointer"
                  >
                    CONTINUE TO REVIEW
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <div className="bg-white border border-gray-200 p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-wide uppercase">
                  REVIEW ORDER
                </h2>

                {/* Shipping Address Review */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                    Shipping Address
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{address.fullName}</p>
                    <p>{address.phone}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state} {address.postalCode}</p>
                    <p>{address.country}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-brand hover:underline mt-2"
                  >
                    Change Address
                  </button>
                </div>

                {/* Payment Method Review */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                    Payment Method
                  </h3>
                  <p className="text-sm text-gray-600">
                    {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-brand hover:underline mt-2"
                  >
                    Change Payment Method
                  </button>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={item.product.image || 'https://placehold.co/800x1200/e5d4e8/666666?text=Image'}
                            alt={item.product.name}
                            fill
                            unoptimized={item.product.image?.startsWith('https://')}
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 uppercase">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {item.product.category || ''} {item.size && `• Size: ${item.size}`}
                          </p>
                          <p className="text-sm text-gray-900 mt-2">
                            ₹ {item.product.price?.toLocaleString('en-IN')} × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 border border-gray-300 text-gray-700 text-sm tracking-wider hover:border-brand hover:text-brand transition-colors cursor-pointer"
                  >
                    BACK
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-3 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-gray-50 border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-wide uppercase">
                ORDER SUMMARY
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span>₹ {cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-brand' : ''}>
                    {shippingCost === 0 ? 'FREE' : `₹ ${shippingCost.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Tax (GST 18%)</span>
                  <span>₹ {tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between text-base font-semibold text-gray-900">
                    <span>TOTAL</span>
                    <span>₹ {total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {cartTotal < 299 && (
                <p className="text-xs text-gray-600 mb-4 text-center">
                  Add ₹ {(299 - cartTotal).toLocaleString('en-IN')} more for free shipping
                </p>
              )}

              <Link
                href="/cart"
                className="block text-center text-xs text-gray-600 hover:text-brand underline"
              >
                Edit Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

