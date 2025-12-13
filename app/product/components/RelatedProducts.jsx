'use client';

import { useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCT_CATALOG, getProductsByCategory } from '../../components/ProductCatalog';

export default function RelatedProducts({ currentProductId, category }) {
  const scrollContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Get related products from the same category, excluding current product
  const relatedProducts = useMemo(() => {
    if (!category) return [];
    
    const categoryProducts = getProductsByCategory(category);
    return categoryProducts
      .filter((product) => product.id !== currentProductId)
      .slice(0, 8); // Limit to 8 related products
  }, [category, currentProductId]);

  if (relatedProducts.length === 0) {
    return null;
  }

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  // Touch/swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (scrollContainerRef.current) {
      if (distance > minSwipeDistance) {
        // Swipe left - scroll right
        scrollRight();
      } else if (distance < -minSwipeDistance) {
        // Swipe right - scroll left
        scrollLeft();
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section className="mt-16 sm:mt-20 lg:mt-24 border-t border-gray-200 pt-12 sm:pt-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 tracking-wide">
          RELATED PRODUCTS
        </h2>

        {/* Scrollable Container with Arrows */}
        <div className="relative">
          {/* Left Arrow - Desktop Only */}
          <button
            onClick={scrollLeft}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 hover:border-black transition-all duration-300 rounded-full shadow-lg cursor-pointer"
            aria-label="Scroll left"
            type="button"
          >
            <svg
              className="w-5 h-5 text-black pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Right Arrow - Desktop Only */}
          <button
            onClick={scrollRight}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 hover:border-black transition-all duration-300 rounded-full shadow-lg cursor-pointer"
            aria-label="Scroll right"
            type="button"
          >
            <svg
              className="w-5 h-5 text-black pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Scrollable Products Container */}
          <div
            ref={scrollContainerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 lg:px-12"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {relatedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug || product.id}`}
                className="group shrink-0 w-[180px] sm:w-[220px] lg:w-[240px]"
              >
                <div className="relative aspect-3/4 bg-gray-100 overflow-hidden mb-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 240px"
                  />
                  {product.tags?.includes('latest-drop') && (
                    <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 text-[10px] font-semibold tracking-wider text-black">
                      NEW
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:underline">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-900">
                    ₹ {product.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

