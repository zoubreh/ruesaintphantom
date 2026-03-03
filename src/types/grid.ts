import type { SanityImage } from './sanity';

/** One image (or video poster) in the flattened home grid. Order = project indexOrder, then cover, then gallery order. */
export interface FlattenedGridItem {
  id: string;
  projectSlug: string;
  projectTitle: string;
  year?: number | null;
  client?: string | null;
  type: 'image' | 'video';
  image: SanityImage | null;
  alt?: string | null;
}
