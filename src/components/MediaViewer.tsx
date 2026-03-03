'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { urlFor, getBlurDataURL } from '@/lib/image';
import type { IndexProject } from '@/types/project';
import type { MediaItem } from '@/types/sanity';

const SWIPE_THRESHOLD = 50;
const GALLERY_IMAGE_SIZE = 1200;

function getMediaItems(project: IndexProject): MediaItem[] {
  const gallery = project.gallery?.filter((m) => m.type === 'image' && m.image) ?? [];
  const coverItem: MediaItem | null = project.coverImage
    ? ({ _key: 'cover', type: 'image', image: project.coverImage } as MediaItem)
    : null;
  if (coverItem && gallery.length === 0) return [coverItem];
  if (coverItem) return [coverItem, ...gallery];
  return gallery;
}

export function MediaViewer({ project, onClose }: { project: IndexProject; onClose: () => void }) {
  const items = getMediaItems(project);
  const [index, setIndex] = useState(0);
  const current = items[index];
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
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

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) < SWIPE_THRESHOLD) return;
    if (diff > 0) goNext();
    else goPrev();
  }, [goNext, goPrev]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-neutral-500">
        <p className="text-sm">No media</p>
      </div>
    );
  }

  const prevIndex = index <= 0 ? items.length - 1 : index - 1;
  const nextIndex = index >= items.length - 1 ? 0 : index + 1;
  const nextItem = items[nextIndex];
  const currentImageUrl =
    current?.type === 'image' && current.image
      ? urlFor(current.image)?.width(GALLERY_IMAGE_SIZE).height(GALLERY_IMAGE_SIZE).fit('max').url() ?? ''
      : '';
  const currentBlur = current?.type === 'image' && current.image ? getBlurDataURL(current.image) : undefined;

  return (
    <div
      ref={containerRef}
      className="relative touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-center min-h-[60vh] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={current?._key ?? index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl aspect-[3/4] md:aspect-auto md:max-h-[80vh]"
          >
            {current?.type === 'image' && current.image && currentImageUrl && (
              <Image
                src={currentImageUrl}
                alt={current.alt ?? project.title}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-contain"
                priority={index === 0}
                placeholder={currentBlur ? 'blur' : 'empty'}
                blurDataURL={currentBlur}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
            aria-label="Previous media"
          >
            <span className="text-2xl">←</span>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
            aria-label="Next media"
          >
            <span className="text-2xl">→</span>
          </button>
        </>
      )}

      {current?.caption && (
        <p className="mt-4 text-sm text-neutral-500 text-center max-w-xl mx-auto">{current.caption}</p>
      )}

      {/* Preload next image via hidden next/Image */}
      {nextItem?.type === 'image' && nextItem.image && (
        <div className="absolute inset-0 -z-10 opacity-0 pointer-events-none w-0 h-0 overflow-hidden" aria-hidden>
          <Image
            src={urlFor(nextItem.image)?.width(GALLERY_IMAGE_SIZE).height(GALLERY_IMAGE_SIZE).fit('max').url() ?? ''}
            alt=""
            width={GALLERY_IMAGE_SIZE}
            height={GALLERY_IMAGE_SIZE}
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
}
