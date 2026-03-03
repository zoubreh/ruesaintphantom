import { client } from './sanity';
import {
  indexProjectsQuery,
  homeGridQuery,
  projectBySlugQuery,
  siteSettingsQuery,
  infoPageQuery,
  type IndexProjectsResult,
  type HomeGridQueryResult,
  type ProjectBySlugResult,
  type SiteSettingsResult,
  type InfoPageResult,
} from './queries';
import type { FlattenedGridItem } from '@/types/grid';

const REVALIDATE = 60;

async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getIndexProjects(): Promise<IndexProjectsResult> {
  return safeFetch(
    () => client.fetch<IndexProjectsResult>(indexProjectsQuery, {}, { next: { revalidate: REVALIDATE } }),
    []
  );
}

/** Flatten all gallery images: one GROQ (ordered by project indexOrder, then gallery order), then flatMap. */
export async function getFlattenedGridItems(): Promise<FlattenedGridItem[]> {
  const rows = await safeFetch(
    () => client.fetch<HomeGridQueryResult>(homeGridQuery, {}, { next: { revalidate: REVALIDATE } }),
    []
  );
  const items: FlattenedGridItem[] = [];
  for (const item of rows.flatMap((p) => p.items)) {
    if (!item.image?.asset?._ref) continue;
    items.push({
      id: item.id,
      projectSlug: item.projectSlug,
      projectTitle: item.projectTitle,
      year: item.year,
      client: item.client,
      type: item.type,
      image: item.image,
      alt: item.alt ?? undefined,
    });
  }
  return items;
}

export async function getProjectBySlug(slug: string): Promise<ProjectBySlugResult> {
  return safeFetch(
    () => client.fetch<ProjectBySlugResult>(projectBySlugQuery, { slug }, { next: { revalidate: REVALIDATE } }),
    null
  );
}

export async function getSiteSettings(): Promise<SiteSettingsResult> {
  return safeFetch(
    () => client.fetch<SiteSettingsResult>(siteSettingsQuery, {}, { next: { revalidate: REVALIDATE } }),
    null
  );
}

export async function getInfoPage(): Promise<InfoPageResult> {
  return safeFetch(
    () => client.fetch<InfoPageResult>(infoPageQuery, {}, { next: { revalidate: REVALIDATE } }),
    null
  );
}
