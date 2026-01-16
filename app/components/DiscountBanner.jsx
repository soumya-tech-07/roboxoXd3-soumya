'use client';

import { useState, useEffect } from 'react';

export default function DiscountBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const couponCode = 'WELCOME20';

  useEffect(() => {
    // Check if user has seen the banner before
    const hasSeenBanner = localStorage.getItem('hasSeenDiscountBanner');
    
    if (!hasSeenBanner) {
      // Show banner after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenDiscountBanner', 'true');
  };

  const handleCopyCoupon = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy coupon code:', err);
    }
  };

  // Don't render if user has already seen and dismissed the banner
  if (typeof window !== 'undefined') {
    const hasSeenBanner = localStorage.getItem('hasSeenDiscountBanner');
    if (hasSeenBanner && !isVisible) return null;
  }

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className={`relative bg-white rounded-lg shadow-2xl max-w-2xl w-full overflow-hidden transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer bg-white/80 rounded-full p-2 hover:bg-white"
          aria-label="Close banner"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2 h-48 md:h-auto bg-gradient-to-br from-brand/20 to-brand/5">
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-bold text-brand mb-2">
                  20%
                </div>
                <div className="text-xl md:text-2xl font-semibold text-gray-900 tracking-wide">
                  OFF
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-16 h-16 border-4 border-brand/30 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-4 border-brand/20 rounded-full"></div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome to Retro Louve!
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                Get <span className="font-semibold text-brand">20% OFF</span> on your first order. 
                Use the coupon code below at checkout.
              </p>
            </div>

            {/* Coupon Code Section */}
            <div className="mt-6">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Your Coupon Code
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center justify-between bg-gray-50 border-2 border-dashed border-brand px-4 py-3 rounded-lg">
                  <span className="text-lg md:text-xl font-bold text-brand tracking-wider">
                    {couponCode}
                  </span>
                  <svg
                    className="w-5 h-5 text-brand"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <button
                  onClick={handleCopyCoupon}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm tracking-wide transition-all duration-200 cursor-pointer ${
                    isCopied
                      ? 'bg-green-500 text-white'
                      : 'bg-brand text-white hover:bg-brand/90'
                  }`}
                >
                  {isCopied ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
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

            {/* CTA Button */}
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
// push to github.
