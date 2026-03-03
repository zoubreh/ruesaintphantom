import type { SanityImage, GridSize } from './sanity';

/** One project tile in the homepage grid. One entry per project. */
export interface ProjectGridItem {
  _id: string;
  slug: string;
  title: string;
  year?: number | null;
  client?: string | null;
  category?: string | null;
  coverImage: SanityImage;
  gridSize: GridSize;
}
