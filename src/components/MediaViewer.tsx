'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { urlFor, getBlurDataURL } from '@/lib/image';
import {
  SWIPE_THRESHOLD,
  SWIPE_VELOCITY,
  GALLERY_IMAGE_SIZE,
  CAROUSEL_SLIDE_DURATION,
} from '@/lib/constants';
import type { IndexProject } from '@/types/project';
import type { MediaItem } from '@/types/sanity';

function getMediaItems(project: IndexProject): MediaItem[] {
  const gallery = project.gallery?.filter((m) => m.type === 'image' && m.image) ?? [];
  const coverItem: MediaItem | null = project.coverImage
    ? ({ _key: 'cover', type: 'image', image: project.coverImage } as MediaItem)
    : null;
  if (coverItem && gallery.length === 0) return [coverItem];
  if (coverItem) return [coverItem, ...gallery];
  return gallery;
}

/* Directional slide variants */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
  }),
};

export function MediaViewer({ project, onClose }: { project: IndexProject; onClose: () => void }) {
  const items = getMediaItems(project);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const current = items[index];

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
  }, [items.length]);

  // Keyboard: arrows + ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, goPrev, goNext]);

  // Preload adjacent images
  useEffect(() => {
    if (items.length <= 1) return;

    const prevIdx = index <= 0 ? items.length - 1 : index - 1;
    const nextIdx = index >= items.length - 1 ? 0 : index + 1;
    const links: HTMLLinkElement[] = [];

    [prevIdx, nextIdx].forEach((idx) => {
      const item = items[idx];
      if (item?.type === 'image' && item.image) {
        const url = urlFor(item.image)?.width(GALLERY_IMAGE_SIZE).height(GALLERY_IMAGE_SIZE).fit('max').url();
        if (url) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = url;
          document.head.appendChild(link);
          links.push(link);
        }
      }
    });

    return () => {
      links.forEach((l) => {
        if (l.parentNode) l.parentNode.removeChild(l);
      });
    };
  }, [index, items]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-foreground-secondary">
        <p className="text-sm">No media</p>
      </div>
    );
  }

  const currentImageUrl =
    current?.type === 'image' && current.image
      ? urlFor(current.image)?.width(GALLERY_IMAGE_SIZE).height(GALLERY_IMAGE_SIZE).fit('max').url() ?? ''
      : '';
  const currentBlur = current?.type === 'image' && current.image ? getBlurDataURL(current.image) : undefined;

  return (
    <div className="relative">
      {/* Carousel container */}
      <div className="flex items-center justify-center min-h-[60vh] relative">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={current?._key ?? index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: CAROUSEL_SLIDE_DURATION, ease: [0.25, 0.1, 0.25, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (items.length <= 1) return;
              if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -SWIPE_VELOCITY) goNext();
              else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > SWIPE_VELOCITY) goPrev();
            }}
            className="relative w-full max-w-4xl aspect-[3/4] md:aspect-auto md:max-h-[80vh] cursor-grab active:cursor-grabbing"
          >
            {current?.type === 'image' && current.image && currentImageUrl && (
              <Image
                src={currentImageUrl}
                alt={current.alt ?? project.title}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-contain pointer-events-none"
                priority={index === 0}
                placeholder={currentBlur ? 'blur' : 'empty'}
                blurDataURL={currentBlur}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded"
            aria-label="Previous media"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 4L6 10L12 16" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded"
            aria-label="Next media"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M8 4L14 10L8 16" />
            </svg>
          </button>
        </>
      )}

      {/* Image counter + caption */}
      <div className="mt-4 text-center">
        {items.length > 1 && (
          <span className="text-xs text-muted tracking-wider" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {index + 1} / {items.length}
          </span>
        )}
        {current?.caption && (
          <p className="mt-1 text-sm text-foreground-secondary max-w-xl mx-auto">{current.caption}</p>
        )}
      </div>
    </div>
  );
}
