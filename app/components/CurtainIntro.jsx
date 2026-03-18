'use client';

import { useEffect, useState } from 'react';

const SESSION_KEY = 'rl_curtain_shown';
const AUTO_OPEN_DELAY = 2500;

export default function CurtainIntro() {
  const [visible, setVisible] = useState(false);
  const [opening, setOpening] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY)) {
      setUnmounted(true);
      return;
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(open, AUTO_OPEN_DELAY);
    return () => clearTimeout(timer);
  }, [visible]);

  const open = () => {
    if (opening) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    setOpening(true);
    setTimeout(() => setUnmounted(true), 1500);
  };

  if (unmounted || !visible) return null;

  return (
    <div
      className="curtain-wrapper"
      onClick={open}
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
              fill="#1a1a1a"
            />
          </svg>

          {/* Bounce arrow — nudges user to pull the curtain */}
          <div className="curtain-pull-hint">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Centred logo — fades out as shutter lifts */}
      <div className={`curtain-logo ${opening ? 'curtain-logo-fade' : ''}`}>
        <span className="curtain-brand">RETRO LOUVE</span>
        <span className="curtain-line" />
        <span className="curtain-tagline">Slow Fashion. Real Style.</span>
      </div>
    </div>
  );
}
