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
      links.forEach((l) => { if (l.parentNode) l.parentNode.removeChild(l); });
    };
  }, [index, items]);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-[#737373]">
        <p className="text-[13px] uppercase tracking-wider">No media</p>
      </div>
    );
  }

  const currentImageUrl =
    current?.type === 'image' && current.image
      ? urlFor(current.image)?.width(GALLERY_IMAGE_SIZE).height(GALLERY_IMAGE_SIZE).fit('max').url() ?? ''
      : '';
  const currentBlur = current?.type === 'image' && current.image ? getBlurDataURL(current.image) : undefined;

  return (
    <div className="relative pt-4 pb-6">
      {/* Project title + meta */}
      <div className="mb-6">
        <h1 className="text-[18px] font-bold uppercase tracking-[0.04em] text-[#1a1a1a]">
          {project.title}
        </h1>
        <div className="flex flex-wrap gap-x-3 mt-1 text-[13px] uppercase tracking-[0.027em] text-[#737373]">
          {project.client && <span>{project.client}</span>}
          {project.year && <span>{project.year}</span>}
        </div>
        {project.description && (
          <p className="mt-4 text-[13px] text-[#525252] leading-[1.6] max-w-xl">
            {project.description}
          </p>
        )}
      </div>

      {/* Carousel */}
      <div className="flex items-center justify-center bg-[#f5f5f5] relative overflow-hidden">
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
            className="relative w-full h-[60vh] md:h-[80vh] cursor-grab active:cursor-grabbing"
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

        {/* Navigation arrows */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#525252] hover:text-[#1a1a1a] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] bg-white/80 border border-[#e5e5e5]"
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 4L6 10L12 16" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#525252] hover:text-[#1a1a1a] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] bg-white/80 border border-[#e5e5e5]"
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M8 4L14 10L8 16" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Counter + caption */}
      <div className="mt-3 text-left">
        {items.length > 1 && (
          <span className="text-[11px] uppercase tracking-wider text-[#737373]" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {index + 1} / {items.length}
          </span>
        )}
        {current?.caption && (
          <p className="mt-1 text-[13px] text-[#737373] max-w-xl">{current.caption}</p>
        )}
      </div>
    </div>
  );
}
