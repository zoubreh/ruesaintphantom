import { client } from './sanity';
import {
  indexProjectsQuery,
  homepageFramesQuery,
  allProjectSlugsQuery,
  projectBySlugQuery,
  siteSettingsQuery,
  infoPageQuery,
  type IndexProjectsResult,
  type HomepageFramesQueryResult,
  type AllProjectSlugsResult,
  type ProjectBySlugResult,
  type SiteSettingsResult,
  type InfoPageResult,
} from './queries';
import type { HomepageGridItem } from '@/types/grid';

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

/** Homepage frames — multiple curated frames per project, flattened into one grid. */
export async function getHomepageFrames(): Promise<HomepageGridItem[]> {
  const rows = await safeFetch(
    () => client.fetch<HomepageFramesQueryResult>(homepageFramesQuery, {}, { next: { revalidate: REVALIDATE } }),
    []
  );
  return rows.flatMap((r) => r.frames).filter((f) => f.image?.asset?._ref);
}

/** Ordered slug list for next/prev navigation. */
export async function getProjectNavigation(): Promise<AllProjectSlugsResult> {
  return safeFetch(
    () => client.fetch<AllProjectSlugsResult>(allProjectSlugsQuery, {}, { next: { revalidate: REVALIDATE } }),
    []
  );
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
