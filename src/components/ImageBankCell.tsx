'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { urlFor, getBlurDataURL } from '@/lib/image';
import { INDEX_SCROLL_KEY } from '@/lib/constants';
import type { FlattenedGridItem } from '@/types/grid';

export function ImageBankCell({
  item,
  priority = false,
  index = 0,
}: {
  item: FlattenedGridItem;
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

  const hasImage = !!item.image?.asset?._ref;
  const src = hasImage ? urlFor(item.image)?.width(800).height(800).fit('max').url() ?? '' : '';
  const blurUrl = hasImage ? getBlurDataURL(item.image) : undefined;

  const saveScroll = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem(INDEX_SCROLL_KEY, String(window.scrollY));
  };

  const staggerDelay = (index % 5) * 0.04;
  const meta = [item.year, item.client].filter(Boolean);

  if (!hasImage) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: staggerDelay }}
      >
        <Link
          href={`/projects/${item.projectSlug}`}
          className="block relative aspect-[3/4] bg-neutral-800 cursor-pointer active:scale-[0.98] transition-transform"
          onClick={saveScroll}
          scroll={false}
        >
          <span className="sr-only">{item.projectTitle}</span>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: staggerDelay }}
      className="h-full min-h-0"
    >
      <Link
        href={`/projects/${item.projectSlug}`}
        className="block relative w-full aspect-[3/4] overflow-hidden group cursor-pointer active:scale-[0.98] transition-transform rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-500"
        onClick={saveScroll}
        scroll={false}
      >
        <Image
          src={src}
          alt={item.alt ?? item.projectTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
          priority={priority}
          placeholder={blurUrl ? 'blur' : 'empty'}
          blurDataURL={blurUrl}
        />
        {/* Hover overlay: pointer-events-none so it never blocks the link */}
        {isDesktop && (
          <span
            className="absolute inset-0 bg-black/40 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            aria-hidden
          >
            <span className="text-[10px] md:text-xs font-medium text-white/90 uppercase tracking-wider truncate">
              {item.projectTitle}
            </span>
            {meta.length > 0 && (
              <span className="text-[10px] md:text-xs text-white/70 truncate">{meta.join(' · ')}</span>
            )}
          </span>
        )}
      </Link>
    </motion.div>
  );
}
