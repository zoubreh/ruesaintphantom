import { client } from './sanity';
import {
  indexProjectsQuery,
  projectGridQuery,
  allProjectSlugsQuery,
  projectBySlugQuery,
  siteSettingsQuery,
  infoPageQuery,
  type IndexProjectsResult,
  type ProjectGridQueryResult,
  type AllProjectSlugsResult,
  type ProjectBySlugResult,
  type SiteSettingsResult,
  type InfoPageResult,
} from './queries';
import type { ProjectGridItem } from '@/types/grid';

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

/** Homepage grid items — one cover per project with gridSize. */
export async function getProjectsForGrid(): Promise<ProjectGridItem[]> {
  return safeFetch(
    () => client.fetch<ProjectGridQueryResult>(projectGridQuery, {}, { next: { revalidate: REVALIDATE } }),
    []
  );
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
