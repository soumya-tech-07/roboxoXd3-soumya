'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export default function HomeBackgroundVideo() {
  const [useVideo, setUseVideo] = useState(true);
  const [isCheckingSpeed, setIsCheckingSpeed] = useState(true);
  const videoRef = useRef(null);

  // Video and image sources
  const videoSrc = 'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4';
  const imageSrc = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&h=1080&fit=crop&q=90';

  // Check internet speed and determine if video should be used
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
            setUseVideo(true);
          } else {
            setUseVideo(false);
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
          setUseVideo(true);
        } else {
          setUseVideo(false);
        }
      } catch (error) {
        // If test fails, default to image
        setUseVideo(false);
      }
      
      setIsCheckingSpeed(false);
    };

    checkConnectionSpeed();
  }, []);

  // Handle video load error - fallback to image
  const handleVideoError = () => {
    setUseVideo(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="relative w-full h-full">
        {/* Show video if connection is good, otherwise show image */}
        {!isCheckingSpeed && (
          <>
            {useVideo ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                autoPlay
                onError={handleVideoError}
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={imageSrc}
                alt="Fashion Collection"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            )}
          </>
        )}

        {/* Optional dark overlay for readability */}
        <div className="absolute inset-0 bg-black/10 z-20 pointer-events-none" />

        {/* Shop Men and Women Buttons */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={() => scrollToSection('mens-section')}
            className="px-6 md:px-8 py-2 md:py-3 text-brand text-xs md:text-sm tracking-wider font-medium transition-all duration-300 cursor-pointer"
            aria-label="Shop Mens"
            type="button"
          >
            SHOP MENS
          </button>
          <button
            onClick={() => scrollToSection('womens-section')}
            className="px-6 md:px-8 py-2 md:py-3 text-white text-xs md:text-sm tracking-wider font-medium transition-all duration-300 cursor-pointer"
            aria-label="Shop Womens"
            type="button"
          >
            SHOP WOMENS
          </button>
        </div>
      </div>
    </section>
  );
}