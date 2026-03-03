'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const INDEX_SCROLL_KEY = 'indexScrollY'; // saved when opening /projects/[slug] from home

export function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/') return;
    const raw = sessionStorage.getItem(INDEX_SCROLL_KEY);
    if (raw == null) return;
    const y = parseInt(raw, 10);
    if (!Number.isFinite(y)) return;
    sessionStorage.removeItem(INDEX_SCROLL_KEY);
    requestAnimationFrame(() => window.scrollTo({ top: y, behavior: 'instant' }));
  }, [pathname]);

  return null;
}
