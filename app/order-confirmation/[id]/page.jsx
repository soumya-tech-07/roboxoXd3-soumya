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

function getStatusDisplay(status) {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'pending':
      return {
        label: 'Order Placed',
        message: 'Your order has been received and is being processed.',
        color: 'border border-gray-300 text-gray-800 bg-white',
      };
    case 'processing':
    case 'confirmed':
      return {
        label: 'Processing',
        message: 'Your order is being prepared for shipment.',
        color: 'border border-gray-300 text-gray-800 bg-white',
      };
    case 'shipped':
      return {
        label: 'Shipped',
        message: 'Your order is on its way.',
        color: 'border border-gray-300 text-gray-800 bg-white',
      };
    case 'delivered':
    case 'completed':
      return {
        label: 'Delivered',
        message: 'Your order has been delivered.',
        color: 'border border-brand/30 text-brand bg-white',
      };
    case 'cancelled':
      return {
        label: 'Cancelled',
        message: 'This order has been cancelled.',
        color: 'border border-gray-300 text-gray-800 bg-white',
      };
    default:
      return {
        label: status || 'Pending',
        message: 'Your order is being processed.',
        color: 'border border-gray-300 text-gray-800 bg-white',
      };
  }
}

/**
 * Payment display from payment method, payment_status (backend), and order status.
 * COD + delivered → Paid; COD + cancelled → Cancelled; Prepaid + cancelled → Refunded.
 */
function getPaymentDisplay(paymentMethod, paymentStatus, orderStatus) {
  const method = (paymentMethod || '').toUpperCase();
  const payStatus = (paymentStatus || '').toLowerCase();
  const orderStat = (orderStatus || '').toLowerCase();
  const isOrderCancelled = orderStat === 'cancelled';
  const isOrderDelivered = ['delivered', 'completed'].includes(orderStat);

  if (method === 'WALLET') {
    const isPaid = payStatus === 'paid' || payStatus === 'completed';
    return {
      method: 'Wallet',
      status: isPaid || isOrderDelivered ? 'Paid' : (paymentStatus || 'Pending'),
      statusColor: isPaid || isOrderDelivered
        ? 'text-brand'
        : 'text-gray-800',
    };
  }

  if (payStatus === 'refunded') {
    return { method: method === 'COD' ? 'Cash on Delivery' : 'Online Payment', status: 'Refunded', statusColor: 'text-gray-800' };
  }
  if (payStatus === 'refund_initiated' || payStatus === 'refund_pending') {
    return { method: method === 'COD' ? 'Cash on Delivery' : 'Online Payment', status: 'Refund initiated', statusColor: 'text-gray-800' };
  }

  if (method === 'COD') {
    if (isOrderCancelled) return { method: 'Cash on Delivery', status: 'Cancelled', statusColor: 'text-gray-800' };
    if (isOrderDelivered) return { method: 'Cash on Delivery', status: 'Paid', statusColor: 'text-brand' };
    return { method: 'Cash on Delivery', status: 'Pay on delivery', statusColor: 'text-gray-800' };
  }

  if (method === 'ONLINE' || method === 'RAZORPAY' || method === 'PREPAID') {
    if (isOrderCancelled) return { method: 'Online Payment', status: 'Refunded', statusColor: 'text-gray-800' };
    const isPaid = payStatus === 'paid' || payStatus === 'completed';
    if (isPaid || isOrderDelivered) return { method: 'Online Payment', status: 'Paid', statusColor: 'text-brand' };
    return { method: 'Online Payment', status: paymentStatus || 'Pending', statusColor: 'text-gray-800' };
  }

  return { method: paymentMethod || '—', status: paymentStatus || 'Pending', statusColor: payStatus === 'paid' ? 'text-brand' : 'text-gray-800' };
}

function getExchangeReturnStatusDisplay(status) {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'pending':
      return { label: 'Pending', color: 'border border-gray-300 text-gray-800 bg-white' };
    case 'approved':
      return { label: 'Approved', color: 'border border-brand/30 text-brand bg-white' };
    case 'rejected':
      return { label: 'Rejected', color: 'border border-gray-300 text-gray-800 bg-white' };
    case 'processed':
      return { label: 'Processed', color: 'border border-brand/30 text-brand bg-white' };
    default:
      return { label: status || 'Pending', color: 'border border-gray-300 text-gray-800 bg-white' };
  }
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const { showError } = useToast();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [exchangeReturnRequests, setExchangeReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const orderId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/');
      setTimeout(() => openLogin(), 100);
      setLoading(false);
      return;
    }
    if (user && orderId) loadOrder();
    else setLoading(false);
  }, [orderId, isAuthenticated, user, router, authLoading]);

  const loadOrder = async () => {
    if (!user || !orderId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (orderError) throw orderError;
      if (!orderData) {
        setLoading(false);
        return;
      }
      setOrder(orderData);

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

      if (itemsError) throw itemsError;

      const itemsWithImages = (itemsData || []).map((item) => {
        const product = item.products;
        let productImage = null;
        if (product) {
          const gallery = Array.isArray(product.gallery)
            ? product.gallery.filter((url) => url && !url.toLowerCase().includes('.heic'))
            : [];
          productImage = gallery.length > 0 ? gallery[0] : (product.image_url || null);
        }
        return { ...item, productImage };
      });
      setOrderItems(itemsWithImages);

      const { data: requestsData } = await supabase
        .from('exchange_return_requests')
        .select('id, order_item_id, request_type, reason, status, created_at')
        .eq('order_id', orderId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setExchangeReturnRequests(requestsData || []);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4" />
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
          <Link href="/" className="text-brand hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shipping_address;
  const statusDisplay = getStatusDisplay(order.status);
  const paymentDisplay = getPaymentDisplay(order.payment_method, order.payment_status, order.status);
  const isCancelled = (order.status || '').toLowerCase() === 'cancelled';
  const hasShipped = ['shipped', 'delivered', 'completed'].includes((order.status || '').toLowerCase());

  const subtotal = Number(order.subtotal ?? 0);
  const shippingCost = Number(order.shipping_cost ?? 0);
  const tax = Number(order.tax ?? 0);
  const discount = Number(order.discount ?? 0);
  const codFee = Number(order.cod_fee ?? 0);
  const total = Number(order.total ?? 0);

  return (
    <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header: dynamic by status */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-5xl font-semibold text-gray-900 mb-2">
            {statusDisplay.label.toUpperCase()}
          </h1>
          <p className="text-sm sm:text-lg text-gray-600">
            {statusDisplay.message}
          </p>
        </div>

        {/* Order status badge */}
        <div className="mb-8 flex justify-center">
          <span className={`inline-flex items-center px-4 py-2 rounded text-sm font-medium ${statusDisplay.color}`}>
            {statusDisplay.label}
          </span>
        </div>

        {/* Order details card */}
        <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Order Number</h3>
              <p className="text-lg font-medium text-brand">{order.order_number}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Order Date</h3>
              <p className="text-sm text-gray-600">
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                  : '—'}
              </p>
            </div>
          </div>

          {shippingAddress && (
            <div className="border-t border-gray-300 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Shipping Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>{shippingAddress.full_name}</p>
                <p>{shippingAddress.phone}</p>
                <p>{shippingAddress.address_line1}</p>
                {shippingAddress.address_line2 && <p>{shippingAddress.address_line2}</p>}
                <p>{[shippingAddress.city, shippingAddress.state, shippingAddress.postal_code].filter(Boolean).join(', ')}</p>
                {shippingAddress.country && <p>{shippingAddress.country}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Cancellation info (only when cancelled) */}
        {isCancelled && (order.cancellation_reason || order.cancellation_notes || order.cancelled_at) && (
          <div className="bg-red-50 border border-red-200 p-6 sm:p-8 mb-8">
            <h3 className="text-sm font-semibold text-red-900 mb-3 uppercase tracking-wide">Cancellation Details</h3>
            {order.cancellation_reason && (
              <p className="text-sm text-red-800 mb-1"><span className="font-medium">Reason:</span> {order.cancellation_reason}</p>
            )}
            {order.cancellation_notes && (
              <p className="text-sm text-red-800 mb-1"><span className="font-medium">Notes:</span> {order.cancellation_notes}</p>
            )}
            {order.cancelled_at && (
              <p className="text-xs text-red-700 mt-2">
                Cancelled on {new Date(order.cancelled_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>
        )}

        {/* Tracking (when shipped/delivered) */}
        {hasShipped && (order.tracking_number || order.tracking_url || order.courier_name || order.shipped_at) && (
          <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Tracking</h3>
            <div className="space-y-2 text-sm text-gray-700">
              {order.courier_name && <p><span className="font-medium">Courier:</span> {order.courier_name}</p>}
              {order.tracking_number && <p><span className="font-medium">Tracking number:</span> {order.tracking_number}</p>}
              {order.tracking_url && (
                <p className="break-all">
                  <span className="font-medium">Tracking link:</span>{' '}
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand underline hover:opacity-80"
                  >
                    {order.tracking_url}
                  </a>
                </p>
              )}
              {order.shipped_at && (
                <p><span className="font-medium">Shipped on:</span> {new Date(order.shipped_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              )}
            </div>
          </div>
        )}

        {/* Exchange / Return requests */}
        {exchangeReturnRequests.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Exchange / Return requests</h3>
            <div className="space-y-3">
              {exchangeReturnRequests.map((req) => {
                const item = orderItems.find((i) => String(i.id) === String(req.order_item_id));
                const statusDisplay = getExchangeReturnStatusDisplay(req.status);
                return (
                  <div key={req.id} className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <span className="text-sm font-medium text-gray-900 capitalize">{req.request_type}</span>
                      {item && (
                        <span className="text-sm text-gray-600 ml-2">— {item.product_name}{item.size ? ` (${item.size})` : ''}</span>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                      {statusDisplay.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Order items */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-wide uppercase">Order Items</h2>
          <div className="space-y-4">
            {orderItems.map((item, index) => {
              const itemRequest = exchangeReturnRequests.find((r) => String(r.order_item_id) === String(item.id));
              return (
              <div key={item.id || index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
                <div className="relative w-20 h-24 bg-gray-100 shrink-0 rounded overflow-hidden">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.product_name}
                      fill
                      quality={60}
                      loading="lazy"
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
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 uppercase">{item.product_name}</p>
                    {itemRequest && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getExchangeReturnStatusDisplay(itemRequest.status).color}`}>
                        {itemRequest.request_type} — {getExchangeReturnStatusDisplay(itemRequest.status).label}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    SKU: {item.product_sku || 'N/A'} {item.size && `• Size: ${item.size}`}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900">₹ {Number(item.subtotal).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>

        {/* Order summary (all from backend) */}
        <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>₹ {subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700">
              <span>Shipping</span>
              <span className={shippingCost === 0 ? 'text-brand' : ''}>
                {shippingCost === 0 ? 'FREE' : `₹ ${shippingCost.toLocaleString('en-IN')}`}
              </span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-sm text-gray-700">
                <span>Tax</span>
                <span>₹ {tax.toLocaleString('en-IN')}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-sm text-gray-700">
                <span>Discount</span>
                <span className="text-green-600">− ₹ {discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            {codFee > 0 && (
              <div className="flex justify-between text-sm text-gray-700">
                <span>COD fee</span>
                <span>₹ {codFee.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-3 mt-3">
              <div className="flex justify-between text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>₹ {total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment (from backend) */}
        <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Payment</h3>
          <p className="text-sm text-gray-600">{paymentDisplay.method}</p>
          <p className="text-sm text-gray-600 mt-2">
            Status: <span className={`font-medium ${paymentDisplay.statusColor}`}>{paymentDisplay.status}</span>
          </p>
        </div>

        {order.notes && (
          <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Notes</h3>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="px-8 py-3 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors text-center">
            Continue Shopping
          </Link>
          <Link href="/orders" className="px-8 py-3 border border-gray-300 text-gray-700 text-sm tracking-wider hover:border-brand hover:text-brand transition-colors text-center">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
