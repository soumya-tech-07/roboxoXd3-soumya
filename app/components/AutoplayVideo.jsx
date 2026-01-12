"use client";

import { useState, useEffect, useRef } from "react";

export default function AutoplayVideo() {
  const [isMobile, setIsMobile] = useState(false);
  const mobileVideoRef = useRef(null);
  const desktopVideoRef = useRef(null);

  // YouTube video IDs (same as HomeBackgroundVideo)
  const mobileVideoId = "ddZyGK0ICrc"; // YouTube Shorts
  const desktopVideoId = "LTQzsR2emPk"; // YouTube video

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Mobile YouTube Video (up to sm) */}
      <div className="block sm:hidden absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          ref={mobileVideoRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          src={`https://www.youtube.com/embed/${mobileVideoId}?autoplay=1&loop=1&playlist=${mobileVideoId}&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&fs=0&cc_load_policy=0&start=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          style={{
            pointerEvents: "none",
            width: "100vw",
            height: "56.25vw", // 16:9 aspect ratio
            minHeight: "100vh",
            minWidth: "177.78vh", // Maintain aspect ratio
          }}
          title="Fashion Video"
          frameBorder="0"
        />
      </div>

      {/* Desktop YouTube Video (after sm) */}
      <div className="hidden sm:block absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          ref={desktopVideoRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          src={`https://www.youtube.com/embed/${desktopVideoId}?autoplay=1&loop=1&playlist=${desktopVideoId}&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&iv_load_policy=3&fs=0&cc_load_policy=0&start=0`}
          allow="autoplay; encrypted-media"
          allowFullScreen={false}
          style={{
            pointerEvents: "none",
            width: "100vw",
            height: "56.25vw", // 16:9 aspect ratio
            minHeight: "100vh",
            minWidth: "177.78vh", // Maintain aspect ratio
          }}
          title="Fashion Video"
          frameBorder="0"
        />
      </div>


   
          
    </section>
  );
}
