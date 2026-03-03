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
  const src = hasImage ? urlFor(item.image)?.width(800).height(800).fit('max').url() ?? '' : '';
  const blurUrl = hasImage ? getBlurDataURL(item.image) : undefined;

  const saveScroll = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem(INDEX_SCROLL_KEY, String(window.scrollY));
  };

  // Stagger delay: subtle left-to-right wave within each row (5 cols max)
  const staggerDelay = (index % 5) * 0.04;

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
          className="block relative aspect-[3/4] bg-neutral-800"
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
    >
      <Link
        href={`/projects/${item.projectSlug}`}
        className="block relative aspect-[3/4] overflow-hidden group"
        onClick={saveScroll}
        scroll={false}
      >
        <Image
          src={src}
          alt={item.alt ?? item.projectTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-all duration-500 ease-out group-hover:opacity-85 group-hover:scale-[1.02]"
          priority={priority}
          placeholder={blurUrl ? 'blur' : 'empty'}
          blurDataURL={blurUrl}
        />
      </Link>
    </motion.div>
  );
}
