import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity';
import type { SanityImage } from '@/types/sanity';

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImage | null | undefined) {
  if (!source?.asset?._ref) return null;
  return builder.image(source);
}

export function buildImageUrl(
  source: SanityImage | null | undefined,
  options: { width?: number; height?: number; fit?: 'max' | 'min' | 'fill'; quality?: number } = {}
) {
  const url = urlFor(source);
  if (!url) return null;
  let u = url;
  if (options.width) u = u.width(options.width);
  if (options.height) u = u.height(options.height);
  if (options.fit) u = u.fit(options.fit);
  if (options.quality != null) u = u.quality(options.quality);
  return u.url();
}

/** Sanity LQIP blur data URL for next/image placeholder="blur". */
export function getBlurDataURL(source: SanityImage | null | undefined): string | undefined {
  const url = urlFor(source);
  if (!url) return undefined;
  return url.width(40).height(40).blur(10).url() ?? undefined;
}
