'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { getSizesFromStockBySize } from '@/lib/product-helpers';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useToast } from '../context/ToastContext';

const supabase = createClient();

export default function ExchangeReturnPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const { showSuccess, showError } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    itemId: '',
    requestType: 'return', // 'return' or 'exchange'
    reason: '',
    exchangeSize: '',
    exchangeProductId: '',
    description: '',
  });

  // Redirect to home and open login modal if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      setTimeout(() => {
        openLogin();
      }, 100);
    }
  }, [isAuthenticated, authLoading, router, openLogin]);

  const loadOrders = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Only delivered/completed orders within 7 days of delivery are eligible
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const deliveredOrders = (data || []).filter((order) => {
        if (!['delivered', 'completed'].includes((order.status || '').toLowerCase())) return false;
        const deliveryDate = order.delivered_at ? new Date(order.delivered_at) : new Date(order.updated_at);
        return deliveryDate >= sevenDaysAgo;
      });
      const deliveredOrderIds = deliveredOrders.map((o) => o.id);

      const { data: requestsData } = await supabase
        .from('exchange_return_requests')
        .select('id, order_id, order_item_id, status')
        .eq('user_id', user.id)
        .in('order_id', deliveredOrderIds);
      const requestsByOrderId = {};
      (requestsData || []).forEach((r) => {
        if (!requestsByOrderId[r.order_id]) requestsByOrderId[r.order_id] = [];
        requestsByOrderId[r.order_id].push(r);
      });

      // Load order items for each order with product details
      const ordersWithItems = await Promise.all(
        deliveredOrders.map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id)
            .order('created_at', { ascending: true });

          if (itemsError) throw itemsError;

          // Fetch product details for each item
          const itemsWithProducts = await Promise.all(
            (items || []).map(async (item) => {
              if (item.product_id) {
                const { data: product, error: productError } = await supabase
                  .from('products')
                  .select('id, name, image_url, gallery, stock_by_size')
                  .eq('id', item.product_id)
                  .single();

                if (!productError && product) {
                  const gallery = Array.isArray(product.gallery) 
                    ? product.gallery.filter((url) => url && !url.toLowerCase().includes('.heic'))
                    : [];
                  const productImage = gallery.length > 0 ? gallery[0] : (product.image_url || null);
                  
                  return {
                    ...item,
                    product,
                    productImage,
                  };
                }
              }
              return item;
            })
          );

          return {
            ...order,
            items: itemsWithProducts || [],
            exchangeReturnRequests: requestsByOrderId[order.id] || [],
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
  }, [user, showError]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadOrders();
    }
  }, [isAuthenticated, user, loadOrders]);

  const selectedOrder = orders.find((o) => o.id === formData.orderId);
  const orderRequests = selectedOrder?.exchangeReturnRequests || [];
  const nonEligibleStatuses = ['pending', 'approved', 'processed'];
  const itemHasExistingRequest = (orderItemId) =>
    orderRequests.some(
      (r) => String(r.order_item_id) === String(orderItemId) && nonEligibleStatuses.includes((r.status || '').toLowerCase())
    );
  const eligibleItems = selectedOrder?.items?.filter((item) => !itemHasExistingRequest(item.id)) || [];

  useEffect(() => {
    const order = orders.find((o) => o.id === formData.orderId);
    const requests = order?.exchangeReturnRequests || [];
    const hasExisting = (id) => requests.some((r) => String(r.order_item_id) === String(id) && ['pending', 'approved', 'processed'].includes((r.status || '').toLowerCase()));
    const eligible = (order?.items || []).filter((item) => !hasExisting(item.id));
    if (formData.itemId && eligible.length > 0 && !eligible.some((i) => String(i.id) === String(formData.itemId))) {
      setFormData((prev) => ({ ...prev, itemId: '' }));
    }
  }, [formData.orderId, formData.itemId, orders]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'orderId') next.itemId = '';
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.orderId || !formData.itemId || !formData.reason) {
      showError('Please fill in all required fields');
      return;
    }

    if (formData.requestType === 'exchange' && !formData.exchangeSize && !formData.exchangeProductId) {
      showError('Please select a size or product for exchange');
      return;
    }

    try {
      setSubmitting(true);

      const { error } = await supabase.from('exchange_return_requests').insert({
        user_id: user.id,
        order_id: formData.orderId,
        order_item_id: formData.itemId,
        request_type: formData.requestType,
        reason: formData.reason,
        exchange_size: formData.exchangeSize || null,
        exchange_product_id: formData.exchangeProductId ? Number(formData.exchangeProductId) : null,
        description: formData.description?.trim() || null,
        status: 'pending',
      });

      if (error) throw error;

      showSuccess('Your request has been submitted successfully! Our team will review it within 48-72 hours.');

      setFormData({
        orderId: '',
        itemId: '',
        requestType: 'return',
        reason: '',
        exchangeSize: '',
        exchangeProductId: '',
        description: '',
      });

      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error submitting request:', error);
      showError(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedItem = selectedOrder?.items?.find((item) => String(item.id) === String(formData.itemId));
  const selectedProduct = selectedItem?.product;
  const selectedItemImage = selectedItem?.productImage ?? selectedItem?.product?.image_url ?? selectedItem?.product?.gallery?.[0];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-32 sm:pt-40 lg:pt-60 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-6 mb-6">
            <h3 className="text-xs text-black sm:text-sm tracking-[0.3em] uppercase font-light whitespace-nowrap">
              EXCHANGE / RETURN
            </h3>
            <div className="flex-1 h-px bg-black" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-black font-serif tracking-tight mb-4">
            Place an Exchange/Return Request
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
            Select an order and item to initiate an exchange or return request. 
            Our team will review your request within 48-72 hours.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 sm:p-8 lg:p-12">
          {/* Request Type */}
          <div className="mb-8">
            <label className="block text-xs tracking-wider text-gray-900 mb-4 uppercase font-semibold">
              REQUEST TYPE
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="requestType"
                  value="return"
                  checked={formData.requestType === 'return'}
                  onChange={handleChange}
                  className="w-4 h-4 text-brand focus:ring-brand"
                />
                <span className="text-sm text-gray-900">Return</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="requestType"
                  value="exchange"
                  checked={formData.requestType === 'exchange'}
                  onChange={handleChange}
                  className="w-4 h-4 text-brand focus:ring-brand"
                />
                <span className="text-sm text-gray-900">Exchange</span>
              </label>
            </div>
          </div>

          {/* Select Order */}
          <div className="mb-8">
            <label className="block text-xs tracking-wider text-gray-900 mb-3 uppercase font-semibold">
              SELECT ORDER <span className="text-red-500">*</span>
            </label>
            <select
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors cursor-pointer"
              required
            >
              <option value="">Choose an order...</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  Order #{order.order_number} - {new Date(order.created_at).toLocaleDateString()} - ₹{Number(order.total).toLocaleString('en-IN')}
                </option>
              ))}
            </select>
            {orders.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">
                No eligible orders. Exchange/return is allowed only for delivered orders and within 7 days of delivery.
              </p>
            )}
            {orders.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Return/exchange is allowed only within 7 days of delivery.
              </p>
            )}
          </div>

          {/* Select Item */}
          {selectedOrder && (
            <div className="mb-8">
              <label className="block text-xs tracking-wider text-gray-900 mb-3 uppercase font-semibold">
                SELECT ITEM <span className="text-red-500">*</span>
              </label>
              <select
                name="itemId"
                value={formData.itemId}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors cursor-pointer"
                required
              >
                <option value="">Choose an item...</option>
                {eligibleItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.product_name} - Size: {item.size || 'N/A'} - Qty: {item.quantity}
                  </option>
                ))}
              </select>
              {selectedOrder.items?.length > 0 && eligibleItems.length < selectedOrder.items.length && (
                <p className="text-xs text-gray-500 mt-2">
                  Items with a return/exchange in progress or already returned/exchanged are not listed. Rejected requests can be submitted again.
                </p>
              )}

              {/* Selected Item Preview */}
              {selectedItem && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 flex gap-4 items-center">
                  <div className="relative w-20 h-24 shrink-0 rounded overflow-hidden bg-gray-200">
                    {selectedItemImage ? (
                      <Image
                        src={selectedItemImage}
                        alt={selectedItem.product_name}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized={typeof selectedItemImage === 'string' && selectedItemImage.startsWith('https://')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {selectedItem.product_name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      Size: {selectedItem.size || 'N/A'} | Quantity: {selectedItem.quantity}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Price: ₹{Number(selectedItem.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Exchange Options */}
          {formData.requestType === 'exchange' && selectedProduct && (
            <div className="mb-8">
              <label className="block text-xs tracking-wider text-gray-900 mb-3 uppercase font-semibold">
                EXCHANGE FOR
              </label>
              <div className="space-y-4">
                {/* Exchange Size */}
                {(() => {
                  const exchangeSizes = getSizesFromStockBySize(selectedProduct.stock_by_size);
                  return exchangeSizes.length > 0 && (
                    <div>
                      <label className="block text-xs text-gray-700 mb-2">Different Size</label>
                      <select
                        name="exchangeSize"
                        value={formData.exchangeSize}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors cursor-pointer"
                      >
                        <option value="">Select size...</option>
                        {exchangeSizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="mb-8">
            <label className="block text-xs tracking-wider text-gray-900 mb-3 uppercase font-semibold">
              REASON <span className="text-red-500">*</span>
            </label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors cursor-pointer"
              required
            >
              <option value="">Select a reason...</option>
              <option value="wrong-size">Wrong Size</option>
              <option value="defective">Defective/Damaged Item</option>
              <option value="wrong-item">Wrong Item Received</option>
              <option value="not-as-described">Not as Described</option>
              <option value="quality-issue">Quality Issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block text-xs tracking-wider text-gray-900 mb-3 uppercase font-semibold">
              ADDITIONAL DETAILS
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors resize-none"
              placeholder="Please provide any additional details about your request..."
            />
          </div>

          {/* Important Notice */}
          <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <p className="text-xs text-yellow-800">
              <strong>Important:</strong> Products must be unused, unwashed, with tags attached. 
              A ₹100 pickup fee applies per order. Shipping/COD charges are non-refundable. 
              Refunds are issued as Louve Cash in your Retro Louve Wallet.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link
              href="/orders"
              className="px-8 py-3 border-2 border-gray-300 text-gray-700 text-sm tracking-wider font-medium hover:bg-gray-50 transition-colors cursor-pointer"
            >
              CANCEL
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-8 py-3 bg-brand text-white text-sm tracking-wider font-medium hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
            </button>
          </div>
        </form>

        {/* Policy Link */}
        <div className="mt-8 text-center">
          <Link
            href="/exchange-policy"
            className="text-sm text-gray-600 hover:text-brand underline transition-colors"
          >
            View Exchange/Returns Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

