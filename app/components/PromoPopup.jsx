'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PromoPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user has already seen or closed the popup
    const hasSeenPopup = localStorage.getItem('promoPopupSeen');
    if (hasSeenPopup) return;

    let timeoutId;
    let scrollListener;

    // Time-based trigger (5 seconds after page load)
    timeoutId = setTimeout(() => {
      showPopup();
    }, 5000);

    // Scroll-based trigger (after scrolling 30% of page)
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent > 30 && !hasSeenPopup) {
        showPopup();
        window.removeEventListener('scroll', handleScroll);
      }
    };

    scrollListener = handleScroll;
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);

  const showPopup = () => {
    setIsVisible(true);
    setIsAnimating(true);
  };

  const hidePopup = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem('promoPopupSeen', 'true');
    }, 300); // Match animation duration
  };

  const handleLoginClick = () => {
    // Store that user clicked on the promo
    localStorage.setItem('promoPopupSeen', 'true');
    // Navigate to login page
    router.push('/login');
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black z-[200] transition-opacity duration-300 ${
          isAnimating ? 'opacity-40' : 'opacity-0'
        }`}
        onClick={hidePopup}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
        }}
      />

      {/* Popup Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[90%] max-w-md transition-all duration-300 ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
        }}
      >
        <div className="bg-white border border-gray-200 relative">
          {/* Close Button */}
          <button
            onClick={hidePopup}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors duration-200"
            aria-label="Close popup"
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
                strokeWidth={1.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="p-8 sm:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-3" style={{ letterSpacing: '-0.02em' }}>
                WELCOME TO RETROLOUVE
              </h2>
              <p className="text-sm text-gray-600" style={{ lineHeight: '1.6' }}>
                Join our community and get exclusive access to new drops
              </p>
            </div>

            {/* Promo Badge */}
            <div className="mb-8 text-center">
              <div className="inline-block border border-gray-900 px-6 py-3">
                <p className="text-xs tracking-wider font-medium text-gray-900">
                  GET <span className="text-2xl font-medium mx-1" style={{ letterSpacing: '-0.02em' }}>10%</span> OFF
                </p>
                <p className="text-xs text-gray-600 mt-1">YOUR FIRST ORDER</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleLoginClick}
                className="w-full bg-gray-900 text-white py-3 text-sm tracking-wider font-medium hover:bg-gray-800 transition-colors duration-200"
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
                }}
              >
                SIGN IN TO CLAIM
              </button>

              <button
                onClick={hidePopup}
                className="w-full border border-gray-300 text-gray-900 py-3 text-sm tracking-wider font-medium hover:border-gray-900 transition-colors duration-200"
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
                }}
              >
                MAYBE LATER
              </button>
            </div>

            {/* Fine Print */}
            <p className="text-xs text-gray-500 text-center mt-6" style={{ lineHeight: '1.6' }}>
              Offer valid for new customers only. Sign in or create an account to redeem.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
