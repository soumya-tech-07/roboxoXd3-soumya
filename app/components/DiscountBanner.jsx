'use client';

import { useState, useEffect, useMemo } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { createClient } from '@/lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useCart } from '../context/CartContext';

const supabasePublic = createPublicClient();

const DISMISSED_KEY = 'discountBannerLastDismissed';
const CURTAIN_KEY = 'rl_curtain_shown';
const ONCE_PER_DAY_MS = 24 * 60 * 60 * 1000;
const BANNER_DELAY_MS = 8000;

function formatDiscountDisplay(coupon) {
  if (!coupon) return { percent: null, text: '' };
  const type = (coupon.discount_type || '').toLowerCase();
  const value = Number(coupon.discount_value) || 0;
  if (type === 'percentage') return { percent: value, text: `${Math.round(value)}%` };
  if (type === 'fixed' || type === 'amount') return { percent: null, text: `₹${Math.round(value)}` };
  return { percent: null, text: value ? `${value}%` : '' };
}

export default function DiscountBanner() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { isOpen: isAuthModalOpen } = useAuthModal();
  const { isCartOpen } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [orderCount, setOrderCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const isOverlayOpen = isAuthModalOpen || isCartOpen;

  // Fetch active coupons; filter by validity and usage in JS
  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const { data, error } = await supabasePublic
          .from('discount_coupons')
          .select('id, code, discount_type, discount_value, title, description, show_to, valid_from, valid_until')
          .eq('is_banner', true);

        if (error) throw error;
        const now = new Date();
        const list = (data || []).filter((c) => {
          if (c.valid_from && new Date(c.valid_from) > now) return false;
          if (c.valid_until && new Date(c.valid_until) < now) return false;
          return true;
        });
        if (mounted) setCoupons(list);
      } catch (err) {
        console.error('DiscountBanner: failed to fetch coupons', err);
        if (mounted) setCoupons([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, []);

  // When authenticated, fetch order count for show_to = new_users
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setOrderCount(0);
      return;
    }
    let mounted = true;
    const supabase = createClient();
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(({ count, error }) => {
        if (mounted && !error) setOrderCount(count ?? 0);
        else if (mounted) setOrderCount(0);
      });
    return () => { mounted = false; };
  }, [isAuthenticated, user]);

  const couponToShow = useMemo(() => {
    if (!coupons.length) return null;
    const showTo = (val) => (val || '').toLowerCase().trim();
    for (const c of coupons) {
      const st = showTo(c.show_to);
      if (st === 'all') return c;
      if (st === 'new_users') {
        if (!isAuthenticated) return c;
        if (orderCount === null) continue;
        if (orderCount === 0) return c;
      }
    }
    return null;
  }, [coupons, isAuthenticated, orderCount]);

  // Show banner only after curtain is gone + BANNER_DELAY_MS seconds.
  // If curtain was already dismissed this session, start timer immediately.
  useEffect(() => {
    if (loading || !couponToShow) return;
    if (isOverlayOpen) return;

    // Check if this user/session has already dismissed the banner recently
    if (isAuthenticated && typeof window !== 'undefined') {
      const raw = localStorage.getItem(DISMISSED_KEY);
      const dismissedAt = raw ? parseInt(raw, 10) : 0;
      if (dismissedAt && Date.now() - dismissedAt < ONCE_PER_DAY_MS) return;
    }

    let timer = null;
    const startTimer = () => {
      timer = setTimeout(() => setIsVisible(true), BANNER_DELAY_MS);
    };

    // Curtain already gone in this session — start timer right away
    const curtainAlreadyDone =
      typeof window !== 'undefined' && sessionStorage.getItem(CURTAIN_KEY);

    if (curtainAlreadyDone) {
      startTimer();
    } else {
      // Curtain is still up — wait for it to be fully dismissed first
      window.addEventListener('rl:curtain-dismissed', startTimer, { once: true });
    }

    return () => {
      window.removeEventListener('rl:curtain-dismissed', startTimer);
      if (timer) clearTimeout(timer);
    };
  }, [loading, couponToShow, isAuthenticated, isOverlayOpen]);

  // If another overlay opens while banner is visible, hide it.
  useEffect(() => {
    if (isOverlayOpen && isVisible) setIsVisible(false);
  }, [isOverlayOpen, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    if (isAuthenticated && typeof window !== 'undefined') {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    }
    // Not logged in: don't persist, so banner shows again on next reload/visit
  };

  const handleCopyCoupon = async () => {
    if (!couponToShow?.code) return;
    try {
      await navigator.clipboard.writeText(couponToShow.code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy coupon code:', err);
    }
  };

  const display = useMemo(() => formatDiscountDisplay(couponToShow), [couponToShow]);

  if (loading || !couponToShow) return null;
  if (isOverlayOpen) return null;

  // Logged-in: hide if dismissed in last 24h (already handled in useEffect; here we avoid rendering the overlay until visible)
  if (isAuthenticated && typeof window !== 'undefined') {
    const raw = localStorage.getItem(DISMISSED_KEY);
    const dismissedAt = raw ? parseInt(raw, 10) : 0;
    if (dismissedAt && Date.now() - dismissedAt < ONCE_PER_DAY_MS && !isVisible) return null;
  }

  const title = couponToShow.title || 'Special Offer!';
  const description = couponToShow.description || `Use code ${couponToShow.code} at checkout.`;

  return (
    <div className={`fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className={`relative bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer bg-white/80 rounded-full p-2 hover:bg-white"
          aria-label="Close banner"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 h-48 md:h-auto bg-linear-to-br from-brand/20 to-brand/5">
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-bold text-brand mb-2">
                  {display.percent != null ? `${Math.round(display.percent)}%` : display.text}
                </div>
                <div className="text-xl md:text-2xl font-semibold text-gray-900 tracking-wide">
                  OFF
                </div>
              </div>
            </div>
            <div className="absolute top-4 left-4 w-16 h-16 border-4 border-brand/30 rounded-full" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-4 border-brand/20 rounded-full" />
          </div>

          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                {description}
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Your Coupon Code
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center justify-between bg-gray-50 border-2 border-dashed border-brand px-4 py-3 rounded-lg">
                  <span className="text-lg md:text-xl font-bold text-brand tracking-wider">
                    {couponToShow.code}
                  </span>
                  <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <button
                  onClick={handleCopyCoupon}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                    isCopied ? 'bg-green-500 text-white' : 'bg-brand text-white hover:bg-brand/90'
                  }`}
                >
                  {isCopied ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      COPIED!
                    </span>
                  ) : (
                    'COPY'
                  )}
                </button>
              </div>
              {isCopied && (
                <p className="text-xs text-green-600 mt-2 transition-opacity duration-200">
                  Coupon code copied to clipboard!
                </p>
              )}
            </div>

            <button
              onClick={handleClose}
              className="mt-6 w-full py-3 bg-gray-900 text-white text-sm font-semibold tracking-wide rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              START SHOPPING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
