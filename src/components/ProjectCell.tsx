'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { urlFor, getBlurDataURL } from '@/lib/image';
import { INDEX_SCROLL_KEY } from '@/lib/constants';
import type { HomepageGridItem } from '@/types/grid';
import type { GridSize } from '@/types/sanity';

const ASPECT_MAP: Record<GridSize, string> = {
  S:    'aspect-[3/4]',
  M:    'aspect-[16/10]',
  L:    'aspect-[4/3]',
  TALL: 'aspect-[3/5]',
  WIDE: 'aspect-[16/9]',
};

const WIDTH_MAP: Record<GridSize, number> = {
  S:    600,
  M:    1000,
  L:    1200,
  TALL: 600,
  WIDE: 1200,
};

export function ProjectCell({
  item,
  priority = false,
  index = 0,
}: {
  item: HomepageGridItem;
  priority?: boolean;
  index?: number;
}) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsDesktop(mq.matches);
    const on = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const size = item.gridSize;
  const hasImage = !!item.image?.asset?._ref;
  const imgWidth = WIDTH_MAP[size];
  const src = hasImage
    ? urlFor(item.image)?.width(imgWidth).height(Math.round(imgWidth * 0.75)).fit('crop').url() ?? ''
    : '';
  const blurUrl = hasImage ? getBlurDataURL(item.image) : undefined;

  const saveScroll = () => {
    if (typeof window !== 'undefined')
      sessionStorage.setItem(INDEX_SCROLL_KEY, String(window.scrollY));
  };

  const staggerDelay = (index % 6) * 0.05;
  const meta = [item.year, item.client].filter(Boolean);

  return (
    <motion.div
      className={`grid-cell-${size} min-h-0`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: staggerDelay }}
    >
      <Link
        href={`/projects/${item.projectSlug}`}
        className={`block relative w-full ${ASPECT_MAP[size]} overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded-sm`}
        onClick={saveScroll}
        scroll={false}
      >
        {hasImage ? (
          <Image
            src={src}
            alt={item.alt ?? item.projectTitle}
            fill
            sizes={
              size === 'S' || size === 'TALL'
                ? '(max-width: 640px) 50vw, 25vw'
                : '(max-width: 640px) 50vw, 50vw'
            }
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            priority={priority}
            placeholder={blurUrl ? 'blur' : 'empty'}
            blurDataURL={blurUrl}
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-100" />
        )}

        {/* HAW-LIN style hover overlay — project name + meta, desktop only */}
        {isDesktop && (
          <span
            className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            aria-hidden
          >
            <span className="text-[10px] md:text-xs font-medium text-white/90 uppercase tracking-wider truncate">
              {item.projectTitle}
            </span>
            {meta.length > 0 && (
              <span className="text-[10px] md:text-xs text-white/70 truncate">
                {meta.join(' · ')}
              </span>
            )}
          </span>
        )}
      </Link>
    </motion.div>
  );
}
