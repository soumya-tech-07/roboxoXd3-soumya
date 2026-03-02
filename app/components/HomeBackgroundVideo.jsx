'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';

export default function HomeBackgroundVideo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRefs = useRef([]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkScreenSize();
    setMounted(true);
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Carousel items - mix of images and videos
  const carouselItems = useMemo(
    () => [
      {
        type: 'video',
        mobileSrc: '/videos/mobile.mp4',
        desktopSrc: '/videos/desktop.mp4',
        alt: 'Fashion Video',
      },
      {
        type: 'image',
        mobileSrc: '/images/1.JPG',
        desktopSrc: '/images/1.JPEG',
        alt: 'Fashion Collection',
      },
      {
        type: 'image',
        mobileSrc: '/images/2.2.jpg',
        desktopSrc: '/images/2.jpg',
        alt: 'Street Style Fashion',
      },
      {
        type: 'image',
        mobileSrc: '/images/3.JPG',
        desktopSrc: '/images/3.JPEG',
        alt: 'Modern Fashion',
      },
    ],
    []
  );


  // Handle video play/pause when slide changes
  useEffect(() => {
    // Pause all videos
    videoRefs.current.forEach((video) => {
      if (video && typeof video.pause === 'function') {
        video.pause();
      }
    });

    const currentItem = carouselItems[currentSlide];
    if (!currentItem || currentItem.type !== 'video') return;

    const video = videoRefs.current[currentSlide];
    if (video && typeof video.play === 'function') {
      video.currentTime = 0;
      video.play().catch(() => { });
    }
  }, [currentSlide, carouselItems]);

  // Navigation functions
  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < carouselItems.length) {
      setCurrentSlide(index);
    }
  }, [carouselItems.length]);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  }, [carouselItems.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  }, [carouselItems.length]);

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

    if (distance > minSwipeDistance) {
      // Swipe left - next slide
      goToNext();
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous slide
      goToPrevious();
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [goToPrevious, goToNext]);


  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel Container */}
      <div className="relative w-full h-full">
        {carouselItems.map((item, index) => {
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
              {!mounted ? (
                <div className="absolute inset-0 w-full h-full bg-gray-900" />
              ) : item.type === 'video' ? (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover pointer-events-none"
                    src={isMobile ? item.mobileSrc : item.desktopSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
              ) : (
                <>
                  {/* Conditional Rendering based on isMobile */}
                  {isMobile ? (
                    (() => {
                      const mobileSrc = item.mobileSrc || item.src;
                      return mobileSrc && mobileSrc.trim() !== '' ? (
                        <div className="absolute inset-0 w-full h-full">
                          <Image
                            src={mobileSrc}
                            alt={item.alt}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            sizes="100vw"
                          />
                        </div>
                      ) : null;
                    })()
                  ) : (
                    (() => {
                      const desktopSrc = item.desktopSrc || item.src;
                      return desktopSrc && desktopSrc.trim() !== '' ? (
                        <div className="absolute inset-0 w-full h-full">
                          <Image
                            src={desktopSrc}
                            alt={item.alt}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            sizes="100vw"
                          />
                        </div>
                      ) : null;
                    })()
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Optional dark overlay for readability */}
        <div className="absolute inset-0 bg-black/10 z-20 pointer-events-none" />

        {/* Left Navigation Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 rounded-sm opacity-80 hover:opacity-100 cursor-pointer"
          aria-label="Previous slide"
          type="button"
        >
          <svg
            className="w-5 h-5 text-white pointer-events-none"
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

        {/* Right Navigation Button */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 rounded-sm opacity-80 hover:opacity-100 cursor-pointer"
          aria-label="Next slide"
          type="button"
        >
          <svg
            className="w-5 h-5 text-white pointer-events-none"
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

        {/* Shop Men and Women Buttons */}
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col justify-center items-center sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <button
            onClick={() => scrollToSection('womens-section')}
            className=" w-[180px] sm:w-auto sm:min-w-[180px] px-6 sm:px-8 border-2 border-white hover:border-brand hover:bg-brand hover:text-white py-3  text-white text-xs sm:text-sm md:text-base tracking-wider font-medium transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm"
            aria-label="Shop Womens"
            type="button"
          >
            SHOP WOMEN
          </button>

          <button
            onClick={() => scrollToSection('mens-section')}
            className="w-[180px] sm:w-auto sm:min-w-[180px] px-6 sm:px-8 border-2 border-white hover:border-brand hover:bg-brand hover:text-white py-3  text-white text-xs sm:text-sm md:text-base tracking-wider font-medium transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm"
            aria-label="Shop Mens"
            type="button"
          >
            SHOP MEN
          </button>


        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${index === currentSlide
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Go to slide ${index + 1}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}