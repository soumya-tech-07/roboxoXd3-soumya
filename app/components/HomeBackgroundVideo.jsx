'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';

export default function HomeBackgroundVideo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRefs = useRef([]);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Carousel items - mix of images and videos with aesthetic fashion content
  const carouselItems = useMemo(() => [
    {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4',
      alt: 'Fashion Video 1',
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=90',
      alt: 'Fashion Collection',
    },
    {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/2491284/2491284-hd_1920_1080_30fps.mp4',
      alt: 'Fashion Video 2',
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&h=1080&fit=crop&q=90',
      alt: 'Street Style Fashion',
    },
    {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/3044083/3044083-hd_1920_1080_25fps.mp4',
      alt: 'Fashion Video 3',
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&h=1080&fit=crop&q=90',
      alt: 'Modern Fashion',
    },
    {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4',
      alt: 'Fashion Video 4',
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1920&h=1080&fit=crop&q=90',
      alt: 'Fashion Lifestyle',
    },
    {
      type: 'video',
      src: 'https://videos.pexels.com/video-files/2495382/2495382-hd_1920_1080_25fps.mp4',
      alt: 'Fashion Video 5',
    },
    {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=1080&fit=crop&q=90',
      alt: 'Urban Fashion',
    },
  ], []);

  // Handle video play/pause when slide changes
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentSlide && carouselItems[index].type === 'video') {
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
  }, [currentSlide, carouselItems]);

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
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    } else if (distance < -minSwipeDistance) {
      // Swipe right - previous slide
      setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
      } else if (e.key === 'ArrowRight') {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [carouselItems.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newIndex = (currentSlide - 1 + carouselItems.length) % carouselItems.length;
    setCurrentSlide(newIndex);
  };

  const goToNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newIndex = (currentSlide + 1) % carouselItems.length;
    setCurrentSlide(newIndex);
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
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {item.type === 'video' ? (
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                preload="auto"
                autoPlay={index === currentSlide}
              >
                <source src={item.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            )}
          </div>
        ))}

        {/* Optional dark overlay for readability */}
        <div className="absolute inset-0 bg-black/10 z-20 pointer-events-none" />

        {/* Left Navigation Button - Mid Height */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 rounded-sm opacity-80 hover:opacity-100 cursor-pointer"
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

        {/* Right Navigation Button - Mid Height */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 rounded-sm opacity-80 hover:opacity-100 cursor-pointer"
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
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={() => scrollToSection('mens-section')}
            className="px-6 md:px-8 py-2 md:py-3  text-brand text-xs md:text-sm tracking-wider font-medium transition-all duration-300 cursor-pointer"
            aria-label="Shop Mens"
            type="button"
          >
            SHOP MENS
          </button>
          <button
            onClick={() => scrollToSection('womens-section')}
            className="px-6 md:px-8 py-2 md:py-3  text-white text-xs md:text-sm tracking-wider font-medium transition-all duration-300 cursor-pointer"
            aria-label="Shop Womens"
            type="button"
          >
            SHOP WOMENS
          </button>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {carouselItems.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToSlide(index);
              }}
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