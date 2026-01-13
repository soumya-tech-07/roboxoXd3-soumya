'use client';

import { useMemo, useRef } from 'react';
import { PRODUCT_CATALOG, getProductsByCategory } from '../../components/ProductCatalog';
import ProductCard from '../../components/ProductCard';

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
              <div key={product.id} className="shrink-0 w-[180px] sm:w-[220px] lg:w-[240px]">
                <ProductCard
                  product={product}
                  aspectRatio="aspect-3/4"
                  showHoverImage={false}
                  showNewBadge={true}
                  textColor="text-gray-900"
                  priceColor="text-gray-900"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

