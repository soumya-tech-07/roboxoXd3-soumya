'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useToast } from '../context/ToastContext';
import MeasurementForm from '../components/MeasurementForm';

const supabase = createClient();

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, profile } = useAuth();
  const { openLogin } = useAuthModal();
  const { showError } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Redirect to home and open login modal if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      setTimeout(() => {
        openLogin();
      }, 100);
    }
  }, [isAuthenticated, authLoading, router, openLogin]);

  // Load orders when orders tab is active
  useEffect(() => {
    if (isAuthenticated && user && activeTab === 'orders') {
      loadOrders();
    }
  }, [isAuthenticated, user, activeTab]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Load order items for each order with product images
      const ordersWithItems = await Promise.all(
        (data || []).map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id)
            .order('created_at', { ascending: true });

          if (itemsError) throw itemsError;

          // Fetch product images for each item
          const itemsWithImages = await Promise.all(
            (items || []).map(async (item) => {
              if (item.product_id) {
                const { data: product, error: productError } = await supabase
                  .from('products')
                  .select('image_url, gallery')
                  .eq('id', item.product_id)
                  .single();

                if (!productError && product) {
                  const gallery = Array.isArray(product.gallery) 
                    ? product.gallery.filter((url) => url && !url.toLowerCase().includes('.heic'))
                    : [];
                  const productImage = gallery.length > 0 ? gallery[0] : (product.image_url || null);
                  
                  return {
                    ...item,
                    productImage,
                  };
                }
              }
              return item;
            })
          );

          return {
            ...order,
            items: itemsWithImages || [],
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error loading orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getPaymentMethodDisplay = (paymentMethod, paymentStatus) => {
    if (paymentMethod === 'COD') {
      return {
        text: 'Pay on Delivery',
        color: 'text-yellow-600 bg-yellow-50',
      };
    } else if (paymentMethod === 'ONLINE') {
      return {
        text: 'Paid',
        color: 'text-green-600 bg-green-50',
      };
    }
    // Fallback
    return {
      text: paymentStatus === 'paid' ? 'Paid' : 'Pending',
      color: paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50',
    };
  };

  const getDeliveryStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'completed':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
            MY PROFILE
          </h1>
          <p className="text-xs sm:text-sm text-gray-600" style={{ lineHeight: '1.6' }}>
            Manage your account information and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('account')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'account'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
            >
              ACCOUNT INFO
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
            >
              MY ORDERS
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'measurements'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
            >
              BODY MEASUREMENTS
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white">
          {/* Account Info Tab */}
          {activeTab === 'account' && (
            <div className="max-w-2xl">
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
                    ACCOUNT DETAILS
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs tracking-widest text-gray-500 mb-2">
                        NAME
                      </label>
                      <p className="text-base text-gray-900" style={{ lineHeight: '1.6' }}>
                        {profile?.first_name && profile?.last_name
                          ? `${profile.first_name} ${profile.last_name}`
                          : 'Not set'}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <label className="block text-xs tracking-widest text-gray-500 mb-2">
                        EMAIL
                      </label>
                      <p className="text-base text-gray-900" style={{ lineHeight: '1.6' }}>
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-sm text-gray-600" style={{ lineHeight: '1.6' }}>
                    To update your account details, please contact our support team at{' '}
                    <a href="mailto:retrolouve@gmail.com" className="text-black hover:underline">
                      retrolouve@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Order #{order.order_number}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getDeliveryStatus(order.status)}
                              </span>
                              {(() => {
                                const paymentDisplay = getPaymentMethodDisplay(order.payment_method, order.payment_status);
                                return (
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${paymentDisplay.color}`}
                                  >
                                    {paymentDisplay.text}
                                  </span>
                                );
                              })()}
                            </div>
                            <p className="text-sm text-gray-600">
                              Placed on{' '}
                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2">
                            <p className="text-lg font-semibold text-gray-900">
                              ₹ {order.total.toLocaleString('en-IN')}
                            </p>
                            <button
                              onClick={() => toggleOrderDetails(order.id)}
                              className="text-sm text-brand hover:underline cursor-pointer"
                            >
                              {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Summary */}
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-wrap gap-4">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                {item.productImage ? (
                                  <Image
                                    src={item.productImage}
                                    alt={item.product_name}
                                    fill
                                    unoptimized={item.productImage.startsWith('https://')}
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 uppercase">
                                  {item.product_name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                                </p>
                                <p className="text-xs text-gray-900 mt-1">
                                  ₹ {item.subtotal.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <div className="flex items-center justify-center w-16 h-20 bg-gray-50 rounded border border-gray-200">
                              <p className="text-xs text-gray-600">
                                +{order.items.length - 3} more
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expanded Order Details */}
                      {expandedOrder === order.id && (
                        <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Shipping Address */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                Shipping Address
                              </h4>
                              {order.shipping_address && (
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p>{order.shipping_address.full_name}</p>
                                  <p>{order.shipping_address.phone}</p>
                                  <p>{order.shipping_address.address_line1}</p>
                                  {order.shipping_address.address_line2 && (
                                    <p>{order.shipping_address.address_line2}</p>
                                  )}
                                  <p>
                                    {order.shipping_address.city}, {order.shipping_address.state}{' '}
                                    {order.shipping_address.postal_code}
                                  </p>
                                  <p>{order.shipping_address.country}</p>
                                </div>
                              )}
                            </div>

                            {/* Payment Info */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                Payment Information
                              </h4>
                              <div className="text-sm text-gray-600 space-y-2">
                                <div className="flex justify-between">
                                  <span>Payment Method:</span>
                                  <span className="font-medium text-gray-900">
                                    {order.payment_method === 'COD'
                                      ? 'Cash on Delivery'
                                      : 'Online Payment (Razorpay)'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Payment Status:</span>
                                  {(() => {
                                    const paymentDisplay = getPaymentMethodDisplay(order.payment_method, order.payment_status);
                                    return (
                                      <span
                                        className={`px-2 py-1 rounded text-xs font-medium uppercase ${paymentDisplay.color}`}
                                      >
                                        {paymentDisplay.text}
                                      </span>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items Details */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                              Order Items
                            </h4>
                            <div className="space-y-4">
                              {order.items?.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                                >
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
                                    <p className="text-sm font-medium text-gray-900 uppercase mb-1">
                                      {item.product_name}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-2">
                                      SKU: {item.product_sku || 'N/A'} {item.size && `• Size: ${item.size}`}
                                    </p>
                                    <div className="flex justify-between items-center">
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
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                              Order Summary
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-gray-700">
                                <span>Subtotal</span>
                                <span>₹ {order.subtotal.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-700">
                                <span>Shipping</span>
                                <span className={order.shipping_cost === 0 ? 'text-brand' : ''}>
                                  {order.shipping_cost === 0
                                    ? 'FREE'
                                    : `₹ ${order.shipping_cost.toLocaleString('en-IN')}`}
                                </span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-red-600">
                                  <span>Discount</span>
                                  <span>-₹ {order.discount.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div className="border-t border-gray-300 pt-3 mt-3">
                                <div className="flex justify-between text-base font-semibold text-gray-900">
                                  <span>TOTAL</span>
                                  <span>₹ {order.total.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <Link
                              href={`/order-confirmation/${order.id}`}
                              className="px-6 py-3 border border-gray-300 text-gray-700 text-sm tracking-wider hover:border-brand hover:text-brand transition-colors text-center cursor-pointer"
                            >
                              VIEW ORDER
                            </Link>
                            {order.status === 'pending' && (
                              <button
                                onClick={() => {
                                  // TODO: Implement cancel order functionality
                                  showError('Order cancellation feature coming soon');
                                }}
                                className="px-6 py-3 border border-red-300 text-red-600 text-sm tracking-wider hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                CANCEL ORDER
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16 sm:py-24">
                  <div className="max-w-md mx-auto">
                    <svg
                      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                      NO ORDERS YET
                    </h2>
                    <p className="text-sm text-gray-600 mb-8 tracking-wide">
                      You haven&apos;t placed any orders yet. Start shopping to see your orders here.
                    </p>
                    <Link
                      href="/"
                      className="inline-block px-6 py-3 bg-brand text-white text-xs sm:text-sm tracking-wider hover:bg-brand/90 transition-colors cursor-pointer"
                    >
                      START SHOPPING
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Body Measurements Tab */}
          {activeTab === 'measurements' && (
            <div className="max-w-3xl">
              <div className="border border-gray-200 rounded-lg p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
                    YOUR MEASUREMENTS
                  </h2>
                  <p className="text-sm text-gray-600" style={{ lineHeight: '1.6' }}>
                    Save your measurements to get personalized size recommendations on product pages.
                  </p>
                </div>
                <MeasurementForm
                  loadAllCharts={true}
                  showSizeChart={true}
                  submitButtonText="UPDATE MEASUREMENTS"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
