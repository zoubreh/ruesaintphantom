'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
  const hasImage = !!item.image?.asset?._ref;
  const src = hasImage ? urlFor(item.image)?.width(900).height(562).fit('crop').url() ?? '' : '';
  const blurUrl = hasImage ? getBlurDataURL(item.image) : undefined;

  const saveScroll = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem(INDEX_SCROLL_KEY, String(window.scrollY));
  };

  const staggerDelay = (index % 4) * 0.05;
  const meta = [item.client, item.year].filter(Boolean);

  if (!hasImage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: staggerDelay }}
      >
        <Link
          href={`/projects/${item.projectSlug}`}
          className="block group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2"
          onClick={saveScroll}
          scroll={false}
        >
          <div className="relative aspect-[4/3] bg-[#f0f0f0]" />
          <div className="pt-2 pb-3">
            <p className="text-[13px] font-bold uppercase tracking-[0.04em] text-[#1a1a1a] truncate leading-tight">
              {item.projectTitle}
            </p>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1], delay: staggerDelay }}
    >
      <Link
        href={`/projects/${item.projectSlug}`}
        className="block group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2"
        onClick={saveScroll}
        scroll={false}
      >
        {/* Image — opacity fades on hover, no overlay, no scale */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#f0f0f0]">
          <Image
            src={src}
            alt={item.alt ?? item.projectTitle}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-opacity duration-300 ease-out group-hover:opacity-[0.65]"
            priority={priority}
            placeholder={blurUrl ? 'blur' : 'empty'}
            blurDataURL={blurUrl}
          />
        </div>

        {/* Metadata — always visible below image */}
        <div className="pt-2 pb-3">
          <p className="text-[13px] font-bold uppercase tracking-[0.04em] text-[#1a1a1a] truncate leading-tight">
            {item.projectTitle}
          </p>
          {meta.length > 0 && (
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.04em] text-[#737373] truncate">
              {meta.join(' · ')}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
