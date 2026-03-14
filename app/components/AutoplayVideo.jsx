"use client";

import { useEffect, useMemo, useState } from "react";
import { createPublicClient } from "@/lib/supabase/public";

const DEFAULT_MOBILE_VIDEO = "/bottomvideo/Vertical.mov";
const DEFAULT_DESKTOP_VIDEO = "/bottomvideo/Horizontal.mov";

export default function AutoplayVideo() {
  const [isMobile, setIsMobile] = useState(false);
  const [bottomVideo, setBottomVideo] = useState(null);

  useEffect(() => {
    const supabase = createPublicClient();
    (async () => {
      const { data, error } = await supabase
        .from("bottom_video")
        .select("mobile_url, desktop_url")
        .eq("is_active", true)
        .limit(1)
        .maybeSingle();
      if (!error && data) setBottomVideo(data);
    })();
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const videoSrc = useMemo(() => {
    const mobile = bottomVideo?.mobile_url?.trim() || DEFAULT_MOBILE_VIDEO;
    const desktop = bottomVideo?.desktop_url?.trim() || DEFAULT_DESKTOP_VIDEO;
    return isMobile ? mobile : desktop;
  }, [isMobile, bottomVideo]);

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
        preload="metadata"
      />
    </section>
  );
}
