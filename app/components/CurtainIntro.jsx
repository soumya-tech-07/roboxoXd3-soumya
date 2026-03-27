'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'rl_curtain_shown';
const SWIPE_THRESHOLD_PX = 60;

export default function CurtainIntro() {
  // All state starts false/null — safe for SSR, no hydration mismatch
  const [visible, setVisible] = useState(false);
  const [opening, setOpening] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const [touchStartY, setTouchStartY] = useState(null);
  const initialized = useRef(false);

  // Runs only on the client after mount — safe to access sessionStorage here
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    let timer;
    if (sessionStorage.getItem(SESSION_KEY)) {
      // Already shown this session — skip curtain and let banner know immediately
      timer = setTimeout(() => {
        setUnmounted(true);
        window.dispatchEvent(new CustomEvent('rl:curtain-dismissed'));
      }, 0);
    } else {
      timer = setTimeout(() => setVisible(true), 0);
    }
    return () => clearTimeout(timer);
  }, []);

  const open = useCallback(() => {
    if (opening) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    setOpening(true);
    setTimeout(() => {
      setUnmounted(true);
      window.dispatchEvent(new CustomEvent('rl:curtain-dismissed'));
    }, 1500);
  }, [opening]);

  if (unmounted || !visible) return null;

  return (
    <div
      className="curtain-wrapper backdrop-blur-[3px]"
      onClick={open}
      onTouchStart={(e) => {
        if (e.touches?.length) setTouchStartY(e.touches[0].clientY);
      }}
      onTouchEnd={(e) => {
        if (touchStartY == null || !e.changedTouches?.length) return;
        const endY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - endY;
        if (deltaY > SWIPE_THRESHOLD_PX) open();
        setTouchStartY(null);
      }}
      aria-hidden="true"
    >
      {/* Main shutter body */}
      <div className={`curtain-shutter ${opening ? 'curtain-shutter-open' : ''}`}>

        {/* Scalloped curtain hem at the bottom with bounce hint */}
        <div className={`curtain-hem ${opening ? 'curtain-hem-hide' : ''}`}>
          <svg
            viewBox="0 0 1440 60"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            className="curtain-hem-svg"
          >
            {/* Scalloped wave — feels like a draped fabric bottom edge */}
            <path
              d="M0,0 
                 C120,60 240,60 360,30 
                 C480,0  600,60 720,40 
                 C840,20  960,60 1080,30 
                 C1200,0  1320,60 1440,30 
                 L1440,60 L0,60 Z"
              fill="rgba(255,255,255,0.30)"
            />
          </svg>

          {/* Bounce arrow — nudges user to pull the curtain */}
          <div className="curtain-pull-hint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Centred logo — fades out as shutter lifts */}
      <div className={`curtain-logo ${opening ? 'curtain-logo-fade' : ''}`}>
        <span className="curtain-brand">RETRO LOUVE</span>
        <span className="curtain-line" />
        <span className="curtain-tagline">Refined Fabrics. Elevated Feels.</span>

        <div className="curtain-tap-hint">
          <span className="curtain-tap-hint-text">Tap to enter</span>
          <span className="curtain-tap-hint-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}
