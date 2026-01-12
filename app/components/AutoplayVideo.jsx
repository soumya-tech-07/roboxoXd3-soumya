'use client';

import { useRef, useEffect } from 'react';

export default function AutoplayVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Autoplay prevented:', error);
        });
      }
    }
  }, []);

  const handleVideoLoad = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video play error:', error);
      });
    }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={handleVideoLoad}
      >
        <source
          src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4"
          type="video/mp4"
        />
        <source
          src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=139&oauth2_token_id=57447761"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Optional Overlay */}
      <div className="absolute inset-0 z-10" />

      {/* Content Overlay (Optional) */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="text-center text-white">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl mb-6 sm:mb-8 italic">Retro Louve</h1>
          
          {/* Circular Badge */}
          <div className="inline-flex items-center justify-center">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              {/* Rotating Text */}
              <svg className="w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                <path
                  id="circlePath"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="none"
                />
                <text className="text-[8px] fill-white uppercase tracking-widest">
                  <textPath href="#circlePath" startOffset="0%">
                    EXTENSION OF YOU • EXPRESSION • SUBNORAC •
                  </textPath>
                </text>
              </svg>
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand rounded-full flex items-center justify-center">
                  <span className="text-white text-lg sm:text-xl font-bold">R</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}