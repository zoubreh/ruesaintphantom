'use client';

import Link from 'next/link';
import Image from 'next/image';
import { urlFor, getBlurDataURL } from '@/lib/image';
import { INDEX_SCROLL_KEY } from '@/lib/constants';
import type { FlattenedGridItem } from '@/types/grid';

export function ImageBankCell({ item, priority = false }: { item: FlattenedGridItem; priority?: boolean }) {
  const hasImage = !!item.image?.asset?._ref;
  const src = hasImage ? urlFor(item.image)?.width(800).height(800).fit('max').url() ?? '' : '';
  const blurUrl = hasImage ? getBlurDataURL(item.image) : undefined;

  const saveScroll = () => {
    if (typeof window !== 'undefined') sessionStorage.setItem(INDEX_SCROLL_KEY, String(window.scrollY));
  };

  if (!hasImage) {
    return (
      <Link
        href={`/projects/${item.projectSlug}`}
        className="block relative aspect-[3/4] bg-neutral-800"
        onClick={saveScroll}
        scroll={false}
      >
        <span className="sr-only">{item.projectTitle}</span>
      </Link>
    );
  }

  return (
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
        className="object-cover transition-opacity duration-300 group-hover:opacity-80"
        priority={priority}
        placeholder={blurUrl ? 'blur' : 'empty'}
        blurDataURL={blurUrl}
      />
    </Link>
  );
}
