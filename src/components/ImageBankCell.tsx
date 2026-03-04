'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { urlFor, getBlurDataURL } from '@/lib/image';
import { INDEX_SCROLL_KEY } from '@/lib/constants';
import type { FlattenedGridItem } from '@/types/grid';

/**
 * Repeating 8-item pattern — variable masonry sizes.
 * Mobile (<640px): ALL items 1×1 (no spans → readable on 2-col grid).
 * Tablet  (sm, 3-col): TALL = 1×2 row, WIDE = 2-col span.
 * Desktop (lg, 4-col): L = 2×2, TALL = 1×2, WIDE = 2×1, S = 1×1.
 * grid-auto-flow: dense fills any gaps automatically.
 */
function getSizeClasses(index: number): { grid: string; isLarge: boolean } {
  const i = index % 8;
  switch (i) {
    case 0: // L — big square, desktop only
      return { grid: 'col-span-1 row-span-1 sm:row-span-2 lg:col-span-2 lg:row-span-2', isLarge: true };
    case 2: // TALL — 2-row from tablet up
      return { grid: 'col-span-1 row-span-1 sm:row-span-2', isLarge: false };
    case 4: // WIDE — 2-col from tablet up
      return { grid: 'col-span-1 row-span-1 sm:col-span-2', isLarge: true };
    case 6: // TALL variant
      return { grid: 'col-span-1 row-span-1 sm:row-span-2', isLarge: false };
    default: // S — always 1×1
      return { grid: 'col-span-1 row-span-1', isLarge: false };
  }
}

export function ImageBankCell({
  item,
  priority = false,
  index = 0,
}: {
  item: FlattenedGridItem;
  priority?: boolean;
  index?: number;
}) {
  const { grid: sizeClasses, isLarge } = getSizeClasses(index);
  const hasImage = !!item.image?.asset?._ref;
  const src = hasImage
    ? urlFor(item.image)?.width(1000).height(1000).fit('max').url() ?? ''
    : '';
  const blurUrl = hasImage ? getBlurDataURL(item.image) : undefined;

  const saveScroll = () => {
    if (typeof window !== 'undefined')
      sessionStorage.setItem(INDEX_SCROLL_KEY, String(window.scrollY));
  };

  const staggerDelay = (index % 4) * 0.05;

  return (
    <motion.div
      className={sizeClasses}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: staggerDelay }}
    >
      <Link
        href={`/projects/${item.projectSlug}`}
        className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-1"
        onClick={saveScroll}
        scroll={false}
        aria-label={item.projectTitle}
      >
        {/* cell-img triggers the @media hover CSS in globals.css */}
        <div className="cell-img relative h-full overflow-hidden bg-[#ebebeb]">
          {hasImage && src && (
            <Image
              src={src}
              alt={item.alt ?? item.projectTitle}
              fill
              sizes={isLarge
                ? '(max-width: 640px) 50vw, (max-width: 1024px) 66vw, 50vw'
                : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
              }
              className="object-cover"
              priority={priority}
              placeholder={blurUrl ? 'blur' : 'empty'}
              blurDataURL={blurUrl}
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
}
