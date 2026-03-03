import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity';
import type { SanityImage } from '@/types/sanity';

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImage | null | undefined) {
  if (!source?.asset?._ref) return null;
  return builder.image(source);
}

/** Sanity LQIP blur data URL for next/image placeholder="blur". */
export function getBlurDataURL(source: SanityImage | null | undefined): string | undefined {
  const url = urlFor(source);
  if (!url) return undefined;
  return url.width(40).height(40).blur(10).url() ?? undefined;
}
