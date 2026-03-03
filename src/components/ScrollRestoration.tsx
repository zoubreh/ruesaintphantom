'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { INDEX_SCROLL_KEY } from '@/lib/constants';

export function ScrollRestoration() {
  const pathname = usePathname();
  const hasRestored = useRef(false);

  useEffect(() => {
    if (pathname !== '/') {
      hasRestored.current = false;
      return;
    }
    if (hasRestored.current) return;

    const raw = sessionStorage.getItem(INDEX_SCROLL_KEY);
    if (raw == null) return;
    const y = parseInt(raw, 10);
    if (!Number.isFinite(y)) return;
    sessionStorage.removeItem(INDEX_SCROLL_KEY);
    hasRestored.current = true;

    // Double-RAF ensures DOM has painted after React commit
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, behavior: 'instant' });
      });
    });
  }, [pathname]);

  return null;
}
