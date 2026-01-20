'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useAuthModal } from '../../context/AuthModalContext';
import { useToast } from '../../context/ToastContext';

const supabase = createClient();

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const { showError } = useToast();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const orderId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    
    // Wait for auth to finish loading
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/');
      // Small delay to ensure navigation completes, then open login modal
      setTimeout(() => {
        openLogin();
      }, 100);
      setLoading(false);
      return;
    }
    
    if (user && orderId) {
      loadOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, isAuthenticated, user, router, authLoading]);

  const loadOrder = async () => {
    if (!user || !orderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (orderError) {
        console.error('Order error:', orderError);
        throw orderError;
      }

      if (!orderData) {
        console.error('No order data found');
        setLoading(false);
        return;
      }

      setOrder(orderData);

      // Get order items with product images
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products (
            image_url,
            gallery
          )
        `)
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });

      if (itemsError) {
        console.error('Order items error:', itemsError);
        throw itemsError;
      }
      
      // Transform items to include product images
      const itemsWithImages = (itemsData || []).map((item) => {
        const product = item.products;
        let productImage = null;
        
        if (product) {
          // Use first image from gallery array, or fallback to image_url
          const gallery = Array.isArray(product.gallery) 
            ? product.gallery.filter((url) => url && !url.toLowerCase().includes('.heic'))
            : [];
          productImage = gallery.length > 0 ? gallery[0] : (product.image_url || null);
        }
        
        return {
          ...item,
          productImage,
        };
      });
      
      setOrderItems(itemsWithImages);
    } catch (error) {
      console.error('Error loading order:', error);
      showError(error.message || 'Failed to load order details');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white pt-24 sm:pt-32 lg:pt-40 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white pt-24 sm:pt-32 lg:pt-40 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Order Not Found</h1>
          <Link href="/" className="text-brand hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shipping_address;

  return (
    <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Success Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            ORDER CONFIRMED!
          </h1>
          <p className="text-sm text-gray-600">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                ORDER NUMBER
              </h3>
              <p className="text-lg font-medium text-brand">{order.order_number}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                ORDER DATE
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
              SHIPPING ADDRESS
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{shippingAddress?.full_name}</p>
              <p>{shippingAddress?.phone}</p>
              <p>{shippingAddress?.address_line1}</p>
              {shippingAddress?.address_line2 && <p>{shippingAddress.address_line2}</p>}
              <p>
                {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postal_code}
              </p>
              <p>{shippingAddress?.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-wide uppercase">
            ORDER ITEMS
          </h2>
          <div className="space-y-4">
            {orderItems.map((item, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.product_name}
                      fill
                      unoptimized={item.productImage.startsWith('https://')}
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 uppercase">
                    {item.product_name}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    SKU: {item.product_sku || 'N/A'} {item.size && `• Size: ${item.size}`}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      ₹ {item.subtotal.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
            ORDER SUMMARY
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>₹ {order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Shipping</span>
              <span className={order.shipping_cost === 0 ? 'text-brand' : ''}>
                {order.shipping_cost === 0 ? 'FREE' : `₹ ${order.shipping_cost.toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="border-t border-gray-300 pt-3 mt-3">
              <div className="flex justify-between text-base font-semibold text-gray-900">
                <span>TOTAL</span>
                <span>₹ {order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
            PAYMENT METHOD
          </h3>
          <p className="text-sm text-gray-600">
            {order.payment_method === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Payment Status: <span className="uppercase">{order.payment_status}</span>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors text-center cursor-pointer"
          >
            CONTINUE SHOPPING
          </Link>
          <Link
            href="/orders"
            className="px-8 py-3 border border-gray-300 text-gray-700 text-sm tracking-wider hover:border-brand hover:text-brand transition-colors text-center cursor-pointer"
          >
            VIEW ORDERS
          </Link>
        </div>
      </div>
    </div>
  );
}

