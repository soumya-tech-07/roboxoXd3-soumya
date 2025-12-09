'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';

export default function HomeBackgroundVideo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canUseVideos, setCanUseVideos] = useState(true);
  const [isCheckingSpeed, setIsCheckingSpeed] = useState(true);
  const videoRefs = useRef([]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Carousel items - mix of images and videos
  const carouselItems = useMemo(() => [
    {
      type: 'video',
      src: '/images/bg.mp4',
      alt: 'Fashion Video 1',
      fallbackImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=90',
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=90',
      alt: 'Fashion Collection',
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop&q=90',
      alt: 'Street Style Fashion',
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&h=1080&fit=crop&q=90',
      alt: 'Modern Fashion',
    },
  ], []);

  // Check internet speed and determine if videos should be used
  useEffect(() => {
    const checkConnectionSpeed = async () => {
      setIsCheckingSpeed(true);
      
      // Check if navigator.connection is available
      if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          // Check effective type (4g, 3g, 2g, slow-2g)
          const effectiveType = connection.effectiveType;
          // Check downlink speed (Mbps)
          const downlink = connection.downlink;
          
          // Use video if connection is 4g or has good downlink speed (>1.5 Mbps)
          if (effectiveType === '4g' || (downlink && downlink > 1.5)) {
            setCanUseVideos(true);
          } else {
            setCanUseVideos(false);
          }
          setIsCheckingSpeed(false);
          return;
        }
      }

      // Fallback: Try to load a small test file to check speed
      try {
        const startTime = performance.now();
        const testImage = new Image();
        testImage.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100&h=100&fit=crop&q=90&t=' + Date.now();
        
        await new Promise((resolve, reject) => {
          testImage.onload = resolve;
          testImage.onerror = reject;
          setTimeout(reject, 3000); // Timeout after 3 seconds
        });
        
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        // If image loads quickly (< 1 second), assume good connection
        if (loadTime < 1000) {
          setCanUseVideos(true);
        } else {
          setCanUseVideos(false);
        }
      } catch (error) {
        // If test fails, default to images only
        setCanUseVideos(false);
      }
      
      setIsCheckingSpeed(false);
    };

    checkConnectionSpeed();
  }, []);

  // Handle video play/pause when slide changes
  useEffect(() => {
    if (isCheckingSpeed) return;
    
    videoRefs.current.forEach((video, index) => {
      if (video) {
        const item = carouselItems[index];
        if (index === currentSlide && item.type === 'video' && canUseVideos) {
          video.currentTime = 0; // Reset video to start
          video.play().catch((err) => {
            console.log('Video play error:', err);
          });
        } else {
          video.pause();
          video.currentTime = 0; // Reset paused videos
        }
      }
    });
  }, [currentSlide, canUseVideos, isCheckingSpeed, carouselItems]);

  // Navigation functions
  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
  }, []);

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

  // Handle video load error - fallback to image
  const handleVideoError = (index) => {
    // If video fails, we'll show the fallback image
    const item = carouselItems[index];
    if (item.fallbackImage) {
      // The fallback will be handled by showing image instead
    }
  };

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
        {!isCheckingSpeed && carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {item.type === 'video' && canUseVideos ? (
              <>
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  preload="auto"
                  autoPlay={index === currentSlide}
                  onError={() => handleVideoError(index)}
                >
                  <source src={item.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* Fallback image if video fails */}
                {item.fallbackImage && (
                  <Image
                    src={item.fallbackImage}
                    alt={item.alt}
                    fill
                    className="object-cover hidden"
                    sizes="100vw"
                  />
                )}
              </>
            ) : (
              <>
                <Image
                  src={item.type === 'video' && item.fallbackImage ? item.fallbackImage : item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
                {/* Coming Soon text for all slides except the first one */}
                {index > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-brand tracking-wider uppercase">
                      Coming Soon
                    </h2>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

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
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={() => scrollToSection('mens-section')}
            className="px-6 md:px-8 border hover:border-brand hover:bg-brand hover:text-white py-2 md:py-3 text-brand text-xs md:text-sm tracking-wider font-medium transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm"
            aria-label="Shop Mens"
            type="button"
          >
            SHOP MENS
          </button>

          <button
            onClick={() => scrollToSection('womens-section')}
            className="px-6 md:px-8 border hover:border-brand hover:bg-brand hover:text-white py-2 md:py-3 text-white text-xs md:text-sm tracking-wider font-medium transition-all duration-300 cursor-pointer bg-black/20 backdrop-blur-sm"
            aria-label="Shop Womens"
            type="button"
          >
            SHOP WOMENS
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                index === currentSlide
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