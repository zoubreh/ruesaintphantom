'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { urlFor, getBlurDataURL } from '@/lib/image';
import type { FlattenedGridItem } from '@/types/grid';

const INDEX_SCROLL_KEY = 'indexScrollY';

export function ImageBankCell({ item, priority = false }: { item: FlattenedGridItem; priority?: boolean }) {
  const [hover, setHover] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsDesktop(mq.matches);
    const on = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const coverUrl = urlFor(item.image);
  const src = coverUrl?.width(800).height(800).fit('max').url() ?? '';
  const blurUrl = getBlurDataURL(item.image);
  const meta = [item.year, item.client].filter(Boolean);
  const showOverlay = hover && isDesktop;

  const saveScrollAndNavigate = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem(INDEX_SCROLL_KEY, String(window.scrollY));
  };

  return (
    <Link
      href={`/projects/${item.projectSlug}`}
      className="block relative aspect-[3/4] overflow-hidden min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:ring-inset"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={saveScrollAndNavigate}
      scroll={false}
    >
      <Image
        src={src}
        alt={item.alt ?? item.projectTitle}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
        className="object-cover transition-transform duration-300 ease-out"
        style={{ objectFit: 'cover' }}
        priority={priority}
        placeholder={blurUrl ? 'blur' : 'empty'}
        blurDataURL={blurUrl}
      />
      <motion.div
        className="absolute inset-0 bg-surface/70 flex flex-col justify-end p-2 md:p-3"
        initial={false}
        animate={{ opacity: showOverlay ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <p className="text-[10px] md:text-xs font-medium text-neutral-300 uppercase tracking-wider truncate">
          {item.projectTitle}
        </p>
        {meta.length > 0 && (
          <p className="text-[10px] md:text-xs text-neutral-500 mt-0.5 truncate">
            {meta.join(' · ')}
          </p>
        )}
      </motion.div>
    </Link>
  );
}
