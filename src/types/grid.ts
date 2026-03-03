import type { SanityImage, GridSize } from './sanity';

/** One frame on the homepage grid. Multiple frames can belong to the same project. */
export interface HomepageGridItem {
  id: string;
  projectSlug: string;
  projectTitle: string;
  year?: number | null;
  client?: string | null;
  image: SanityImage;
  gridSize: GridSize;
  alt?: string | null;
}
