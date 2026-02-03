"use client";

import { useEffect, useState } from "react";

export default function AutoplayVideo() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const videoSrc = isMobile ? "/bottomvideo/Vertical.mov" : "/bottomvideo/Horizontal.mov";

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <video
        key={videoSrc}
        className="absolute inset-0 w-full h-full object-cover"
        src={videoSrc}
        autoPlay
        muted
        loop
        playsInline
      />
    </section>
  );
}
