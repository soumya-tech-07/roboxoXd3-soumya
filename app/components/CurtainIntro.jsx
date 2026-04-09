'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const SESSION_KEY = 'rl_curtain_shown';

export default function CurtainIntro() {
  // All state starts false/null — safe for SSR, no hydration mismatch
  const [visible, setVisible] = useState(false);
  const [opening, setOpening] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
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

  // Dismiss on ANY interaction: tap/click/scroll/wheel/keys/touch.
  useEffect(() => {
    if (!visible || unmounted || opening) return;

    const opts = { passive: true };
    const onFirstInteraction = () => open();
    const onKeydown = (e) => {
      // Ignore modifier-only presses
      if (e.key === 'Shift' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Meta') return;
      open();
    };

    window.addEventListener('pointerdown', onFirstInteraction, opts);
    window.addEventListener('touchstart', onFirstInteraction, opts);
    window.addEventListener('wheel', onFirstInteraction, opts);
    window.addEventListener('scroll', onFirstInteraction, opts);
    window.addEventListener('keydown', onKeydown);

    return () => {
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('wheel', onFirstInteraction);
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('keydown', onKeydown);
    };
  }, [visible, unmounted, opening, open]);

  if (unmounted || !visible) return null;

  return (
    <div
      className="curtain-wrapper backdrop-blur-[3px]"
      aria-hidden="true"
    >
      {/* Main shutter body */}
      <div className={`curtain-shutter ${opening ? 'curtain-shutter-open' : ''}`}>
      </div>

      {/* Centred logo — fades out as shutter lifts */}
      <div className={`curtain-logo ${opening ? 'curtain-logo-fade' : ''}`}>
        <span className="curtain-brand">RETRO LOUVE</span>
      </div>
    </div>
  );
}
