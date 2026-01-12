'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';

export default function HomeBackgroundVideo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canUseVideos, setCanUseVideos] = useState(true);
  const [isCheckingSpeed, setIsCheckingSpeed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef([]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // YouTube video IDs
  const mobileVideoId = 'ddZyGK0ICrc'; // YouTube Shorts
  const desktopVideoId = 'LTQzsR2emPk'; // YouTube video

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Carousel items - mix of images and videos
  const carouselItems = useMemo(() => [
    {
      type: 'video',
      youtubeId: isMobile ? mobileVideoId : desktopVideoId,
      alt: 'Fashion Video 1',
      fallbackImage: '/images/1.JPEG',
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
  ], [isMobile]);

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
        testImage.src = '/images/1.JPEG?t=' + Date.now();
        
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

  // Handle video visibility when slide changes (YouTube iframes autoplay when visible)
  useEffect(() => {
    if (isCheckingSpeed) return;
    
    // YouTube iframes autoplay when loaded, so we just need to ensure visibility
    // The opacity transition handles showing/hiding
    videoRefs.current.forEach((iframe, index) => {
      if (iframe && iframe.contentWindow) {
        const item = carouselItems[index];
        if (index === currentSlide && item.type === 'video' && canUseVideos) {
          // Iframe will autoplay when visible due to autoplay parameter
          // Optionally reload to restart video
          if (iframe.src) {
            const currentSrc = iframe.src;
            iframe.src = currentSrc; // Trigger reload to restart
          }
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
                {/* Mobile YouTube Video (up to sm) */}
                <div className="block sm:hidden absolute inset-0 w-full h-full overflow-hidden">
                  <iframe
                    ref={(el) => (videoRefs.current[index] = el)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    src={`https://www.youtube.com/embed/${mobileVideoId}?autoplay=1&loop=1&playlist=${mobileVideoId}&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&fs=0&cc_load_policy=0&start=0`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen={false}
                    style={{ 
                      pointerEvents: 'none',
                      width: '100vw',
                      height: '56.25vw', // 16:9 aspect ratio
                      minHeight: '100vh',
                      minWidth: '177.78vh', // Maintain aspect ratio
                    }}
                    title={item.alt}
                    frameBorder="0"
                  />
                </div>
                {/* Desktop YouTube Video (after sm) */}
                <div className="hidden sm:block absolute inset-0 w-full h-full overflow-hidden">
                  <iframe
                    ref={(el) => (videoRefs.current[index] = el)}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    src={`https://www.youtube.com/embed/${desktopVideoId}?autoplay=1&loop=1&playlist=${desktopVideoId}&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&fs=0&cc_load_policy=0&start=0`}
                    allow="autoplay; encrypted-media"
                    allowFullScreen={false}
                    style={{ 
                      pointerEvents: 'none',
                      width: '100vw',
                      height: '56.25vw', // 16:9 aspect ratio
                      minHeight: '100vh',
                      minWidth: '177.78vh', // Maintain aspect ratio
                    }}
                    title={item.alt}
                    frameBorder="0"
                  />
                </div>
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
                {/* Mobile Image (up to sm) */}
                {(() => {
                  const mobileSrc = item.mobileSrc || item.src || item.fallbackImage;
                  return mobileSrc && mobileSrc.trim() !== '' ? (
                    <div className="block sm:hidden absolute inset-0 w-full h-full">
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
                })()}
                {/* Desktop Image (after sm) */}
                {(() => {
                  const desktopSrc = item.desktopSrc || item.src || item.fallbackImage;
                  return desktopSrc && desktopSrc.trim() !== '' ? (
                    <div className="hidden sm:block absolute inset-0 w-full h-full">
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
                })()}
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
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-30 flex flex-col justify-center items-center sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <button
            onClick={() => scrollToSection('mens-section')}
            className="w-[180px] sm:w-auto sm:min-w-[180px] px-6 sm:px-8 border-2 border-white hover:border-brand hover:bg-brand hover:text-white py-3  text-white text-xs sm:text-sm md:text-base tracking-wider font-medium transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm"
            aria-label="Shop Mens"
            type="button"
          >
            SHOP MEN
          </button>

          <button
            onClick={() => scrollToSection('womens-section')}
            className=" w-[180px] sm:w-auto sm:min-w-[180px] px-6 sm:px-8 border-2 border-white hover:border-brand hover:bg-brand hover:text-white py-3  text-white text-xs sm:text-sm md:text-base tracking-wider font-medium transition-all duration-300 cursor-pointer bg-white/10 backdrop-blur-sm"
            aria-label="Shop Womens"
            type="button"
          >
            SHOP WOMEN
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