'use client';

import { useState, useEffect } from 'react';

/** Returns true on devices with a fine pointer (mouse/trackpad), false on touch. */
export function usePointerDevice() {
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mq.matches);
    const handler = () => setIsFinePointer(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isFinePointer;
}
