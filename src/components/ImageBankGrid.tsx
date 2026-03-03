'use client';

import { useRef, useEffect, useState } from 'react';
import { ImageBankCell } from './ImageBankCell';
import type { FlattenedGridItem } from '@/types/grid';

export function ImageBankGrid({ items }: { items: FlattenedGridItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(24);
  const batch = 24;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting)
          setVisibleCount((n) => Math.min(n + batch, items.length));
      },
      { rootMargin: '400px', threshold: 0 }
    );
    const sentinel = el.querySelector('[data-sentinel]');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [items.length]);

  const visible = items.slice(0, visibleCount);

  if (items.length === 0) {
    return (
      <div className="py-24 text-center text-neutral-500">
        <p className="text-sm uppercase tracking-wide">No images yet</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full max-w-full min-w-0 overflow-hidden px-2 sm:px-3">
      <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
        {visible.map((item, i) => (
          <ImageBankCell key={item.id} item={item} priority={i < 2} />
        ))}
      </div>
      <div data-sentinel className="h-1 w-full" aria-hidden />
    </div>
  );
}
