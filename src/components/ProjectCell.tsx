'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { urlFor, getBlurDataURL } from '@/lib/image';
import { INDEX_SCROLL_KEY } from '@/lib/constants';
import type { ProjectGridItem } from '@/types/grid';
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
  item: ProjectGridItem;
  priority?: boolean;
  index?: number;
}) {
  const size = item.gridSize;
  const hasImage = !!item.coverImage?.asset?._ref;
  const imgWidth = WIDTH_MAP[size];
  const src = hasImage
    ? urlFor(item.coverImage)?.width(imgWidth).height(Math.round(imgWidth * 0.75)).fit('crop').url() ?? ''
    : '';
  const blurUrl = hasImage ? getBlurDataURL(item.coverImage) : undefined;

  const saveScroll = () => {
    if (typeof window !== 'undefined')
      sessionStorage.setItem(INDEX_SCROLL_KEY, String(window.scrollY));
  };

  const staggerDelay = (index % 6) * 0.05;
  const meta = [item.category, item.year].filter(Boolean);

  return (
    <motion.div
      className={`grid-cell-${size} min-h-0`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: staggerDelay }}
    >
      <Link
        href={`/projects/${item.slug}`}
        className={`block relative w-full ${ASPECT_MAP[size]} overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded-sm`}
        onClick={saveScroll}
        scroll={false}
      >
        {hasImage ? (
          <Image
            src={src}
            alt={item.title}
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
      </Link>
      <div className="mt-2 mb-4">
        <Link
          href={`/projects/${item.slug}`}
          className="text-xs sm:text-sm font-medium uppercase tracking-wider text-foreground hover:text-foreground-secondary transition-colors"
          onClick={saveScroll}
          scroll={false}
        >
          {item.title}
        </Link>
        {meta.length > 0 && (
          <p className="text-[10px] sm:text-xs text-foreground-secondary uppercase tracking-wider mt-0.5">
            {meta.join(' — ')}
          </p>
        )}
      </div>
    </motion.div>
  );
}
