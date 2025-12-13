'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function ProductImageGallery({ images, productName, badge }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const fallbackImage = 'https://placehold.co/800x1200/e5d4e8/666666?text=Image';
  const allImages = images?.length > 0 ? images : [fallbackImage];
  const mainImage = allImages[selectedImageIndex] ?? fallbackImage;

  const goToPrevious = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToNext = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

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

    if (distance > minSwipeDistance) {
      goToNext();
    } else if (distance < -minSwipeDistance) {
      goToPrevious();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div>
      {/* Main Image Preview */}
      <div
        className="relative aspect-3/4 bg-gray-100 overflow-hidden mb-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={mainImage}
          alt={productName}
          fill
          className="object-cover"
          priority
        />
        {badge && (
          <div className="absolute top-4 left-4 bg-white/10 px-3 py-1 text-black text-xs font-semibold tracking-wider z-10">
            {badge}
          </div>
        )}

        {/* Navigation Arrows - Desktop Only */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 hover:bg-white backdrop-blur-sm transition-all duration-300 rounded-full opacity-80 hover:opacity-100 cursor-pointer shadow-lg"
              aria-label="Previous image"
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

            <button
              onClick={goToNext}
              className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 hover:bg-white backdrop-blur-sm transition-all duration-300 rounded-full opacity-80 hover:opacity-100 cursor-pointer shadow-lg"
              aria-label="Next image"
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
          </>
        )}
      </div>

      {/* Thumbnail Images */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-100 overflow-hidden border-2 transition-all cursor-pointer ${
                selectedImageIndex === index
                  ? 'border-black'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productName} view ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

