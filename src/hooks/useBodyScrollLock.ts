'use client';

import { useEffect, useRef } from 'react';

/**
 * iOS-safe body scroll lock.
 * Uses position:fixed technique — the only reliable method on iOS Safari.
 * Compensates scrollbar width to prevent layout shift.
 */
export function useBodyScrollLock(locked: boolean) {
  const scrollY = useRef(0);

  useEffect(() => {
    if (!locked) return;

    // Measure scrollbar width before hiding it
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    scrollY.current = window.scrollY;

    // Lock: position fixed at current scroll position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      // Unlock: restore all styles and scroll position
      const y = scrollY.current;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      window.scrollTo(0, y);
    };
  }, [locked]);
}
