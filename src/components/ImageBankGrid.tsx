'use client';

import { useRef, useEffect, useState } from 'react';
import { ImageBankCell } from './ImageBankCell';
import { GRID_BATCH_SIZE, GRID_LOAD_MARGIN } from '@/lib/constants';
import type { FlattenedGridItem } from '@/types/grid';

export function ImageBankGrid({ items }: { items: FlattenedGridItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(GRID_BATCH_SIZE);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting)
          setVisibleCount((n) => Math.min(n + GRID_BATCH_SIZE, items.length));
      },
      { rootMargin: GRID_LOAD_MARGIN, threshold: 0 }
    );
    const sentinel = el.querySelector('[data-sentinel]');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [items.length]);

  const visible = items.slice(0, visibleCount);

  if (items.length === 0) {
    return (
      <div className="py-24 text-center text-[#737373]">
        <p className="text-[13px] uppercase tracking-wider">No images yet</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-4 md:pt-6"
    >
      {/* 2-col mobile → 3-col tablet → 4-col desktop, dense masonry */}
      <div className="grid masonry-grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
        {visible.map((item, i) => (
          <ImageBankCell key={item.id} item={item} priority={i < 4} index={i} />
        ))}
      </div>
      <div data-sentinel className="h-1 w-full" aria-hidden />
    </div>
  );
}
