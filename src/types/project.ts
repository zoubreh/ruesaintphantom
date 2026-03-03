import type { MediaItem, SanityImage } from './sanity';

export interface IndexProject {
  _id: string;
  title: string;
  slug: string;
  year?: number | null;
  client?: string | null;
  tags?: string[] | null;
  description?: string | null;
  coverImage: SanityImage;
  gallery?: MediaItem[] | null;
  indexOrder?: number | null;
  published?: boolean | null;
}
