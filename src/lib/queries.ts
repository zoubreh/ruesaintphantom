import type { Project, SiteSettings, InfoPage } from '@/types/sanity';
import type { HomepageGridItem } from '@/types/grid';

const projectFields = `
  _id,
  _type,
  title,
  "slug": slug.current,
  year,
  client,
  tags,
  description,
  coverImage,
  gallery[] {
    _key,
    type,
    image,
    videoUrl,
    poster,
    caption,
    credit,
    alt
  },
  homeFrames[] {
    _key,
    image,
    gridSize,
    alt
  },
  category,
  indexOrder,
  published,
  credits
`;

/** Projects for index (published only, ordered by indexOrder). */
export const indexProjectsQuery = `*[_type == "project" && published == true] | order(indexOrder asc) {
  ${projectFields}
}`;

/**
 * Homepage grid: flatten homeFrames from all projects into one array.
 * Each frame carries its parent project info for linking.
 * Fallback: if a project has no homeFrames, use the coverImage as a single M frame.
 */
export const homepageFramesQuery = `*[_type == "project" && published == true] | order(indexOrder asc) {
  "frames": select(
    defined(homeFrames) && length(homeFrames) > 0 => homeFrames[] {
      "id": ^._id + "-" + _key,
      "projectSlug": ^.slug.current,
      "projectTitle": ^.title,
      "year": ^.year,
      "client": ^.client,
      image,
      "gridSize": coalesce(gridSize, "M"),
      alt
    },
    [{
      "id": _id + "-cover",
      "projectSlug": slug.current,
      "projectTitle": title,
      "year": year,
      "client": client,
      "image": coverImage,
      "gridSize": "M",
      "alt": title
    }]
  )
}`;

/** All published project slugs in order, for next/prev navigation. */
export const allProjectSlugsQuery = `*[_type == "project" && published == true] | order(indexOrder asc) {
  "slug": slug.current,
  title
}`;

/** Project by slug: project meta + ordered gallery. */
export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  ${projectFields}
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  siteTitle,
  seoDescription,
  ogImage,
  socialLinks,
  contactEmail,
  footerNote
}`;

export const infoPageQuery = `*[_type == "infoPage"][0] {
  sections,
  imprintText,
  representedBy,
  address,
  contactEmail,
  programmingBy,
  copyright
}`;

export type IndexProjectsResult = (Omit<Project, 'slug'> & { slug: string })[];
export type HomepageFramesQueryResult = { frames: HomepageGridItem[] }[];
export type ProjectBySlugResult = Omit<Project, 'slug'> & { slug: string } | null;
export type SiteSettingsResult = SiteSettings | null;
export type InfoPageResult = InfoPage | null;

export interface ProjectNavItem {
  slug: string;
  title: string;
}
export type AllProjectSlugsResult = ProjectNavItem[];
