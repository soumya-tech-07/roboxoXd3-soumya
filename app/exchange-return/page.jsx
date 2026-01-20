'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
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
    hasUnboxingVideo: false,
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

      // Load order items for each order with product details
      const ordersWithItems = await Promise.all(
        (data || []).map(async (order) => {
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
                  .select('id, name, image_url, gallery, sizes')
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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

      // Here you would typically save to a database table for exchange/return requests
      // For now, we'll simulate the submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showSuccess('Your request has been submitted successfully! Our team will review it within 48-72 hours.');
      
      // Reset form
      setFormData({
        orderId: '',
        itemId: '',
        requestType: 'return',
        reason: '',
        exchangeSize: '',
        exchangeProductId: '',
        description: '',
        hasUnboxingVideo: false,
      });

      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    } catch (error) {
      console.error('Error submitting request:', error);
      showError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedOrder = orders.find((o) => o.id === formData.orderId);
  const selectedItem = selectedOrder?.items?.find((item) => item.id === formData.itemId);
  const selectedProduct = selectedItem?.product;

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
                  Order #{order.order_number} - {new Date(order.created_at).toLocaleDateString()} - ₹{Number(order.total).toFixed(2)}
                </option>
              ))}
            </select>
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
                {selectedOrder.items?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.product_name} - Size: {item.size || 'N/A'} - Qty: {item.quantity}
                  </option>
                ))}
              </select>

              {/* Selected Item Preview */}
              {selectedItem && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 flex gap-4">
                  {selectedItem.productImage && (
                    <Image
                      src={selectedItem.productImage}
                      alt={selectedItem.product_name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  )}
                  <div className="flex-1">
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
                {selectedProduct.sizes && Array.isArray(selectedProduct.sizes) && selectedProduct.sizes.length > 0 && (
                  <div>
                    <label className="block text-xs text-gray-700 mb-2">Different Size</label>
                    <select
                      name="exchangeSize"
                      value={formData.exchangeSize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-brand transition-colors cursor-pointer"
                    >
                      <option value="">Select size...</option>
                      {selectedProduct.sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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

          {/* Unboxing Video */}
          <div className="mb-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="hasUnboxingVideo"
                checked={formData.hasUnboxingVideo}
                onChange={handleChange}
                className="w-4 h-4 text-brand focus:ring-brand"
              />
              <span className="text-sm text-gray-900">
                I have recorded an unboxing video (Required for damage/wrong item claims)
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-2 ml-7">
              Please email your unboxing video to{' '}
              <a href="mailto:orders.retrolouve@gmail.com" className="underline">
                orders.retrolouve@gmail.com
              </a>{' '}
              within 24 hours of delivery.
            </p>
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

