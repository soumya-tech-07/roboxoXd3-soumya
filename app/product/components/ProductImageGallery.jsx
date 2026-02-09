'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import LuxuryImage from '@/app/components/ui/LuxuryImage';

export default function ProductImageGallery({ images, productName, badge }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const fallbackImage = 'https://placehold.co/800x1200/e5d4e8/666666?text=Image';
  const allImages = useMemo(() => images?.length > 0 ? images : [fallbackImage], [images]);
  const mainImage = allImages[selectedImageIndex] ?? fallbackImage;

  const goToPrevious = useCallback(() => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  }, [allImages.length]);

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

  // Keyboard navigation for fullscreen
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToPrevious, goToNext]);

  // Prevent body scroll when fullscreen is open
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  return (
    <div>
      {/* Main Image Preview */}
      <div
        className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden mb-4 cursor-pointer group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsFullscreen(true)}
      >
        <LuxuryImage
          src={mainImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={mainImage?.startsWith('http')}
        />

        {/* Fullscreen Icon Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </div>
        </div>
        {badge && (
          <div className="absolute top-4 left-4 bg-white/10 px-3 py-1 text-black text-xs font-semibold tracking-wider z-10">
            {badge}
          </div>
        )}

        {/* Navigation Arrows - Desktop Only */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
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
              className={`relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-gray-100 overflow-hidden border-2 transition-all cursor-pointer ${selectedImageIndex === index
                  ? 'border-black'
                  : 'border-gray-200 hover:border-gray-400'
                }`}
              aria-label={`View image ${index + 1}`}
            >
              <LuxuryImage
                src={image}
                alt={`${productName} view ${index + 1}`}
                fill
                sizes="96px"
                unoptimized={image?.startsWith('http')}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(false);
            }}
            className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Close fullscreen"
          >
            <svg
              className="w-6 h-6 text-white"
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

          {/* Fullscreen Image */}
          <div
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-full max-h-full">
              <Image
                src={mainImage}
                alt={productName}
                width={1200}
                height={1600}
                className="max-w-full max-h-[90vh] object-contain"
                unoptimized={mainImage?.startsWith('http')}
                priority
              />
            </div>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 cursor-pointer"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-6 h-6 text-white"
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
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 cursor-pointer"
                  aria-label="Next image"
                >
                  <svg
                    className="w-6 h-6 text-white"
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

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
