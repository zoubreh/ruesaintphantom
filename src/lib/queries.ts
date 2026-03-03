import type { Project, SiteSettings, InfoPage } from '@/types/sanity';
import type { ProjectGridItem } from '@/types/grid';

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
  gridSize,
  category,
  indexOrder,
  published,
  credits
`;

/** Projects for index (published only, ordered by indexOrder). */
export const indexProjectsQuery = `*[_type == "project" && published == true] | order(indexOrder asc) {
  ${projectFields}
}`;

/** Homepage grid: one cover per project with gridSize for editorial layout. */
export const projectGridQuery = `*[_type == "project" && published == true] | order(indexOrder asc) {
  _id,
  title,
  "slug": slug.current,
  year,
  client,
  category,
  coverImage,
  "gridSize": coalesce(gridSize, "M")
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
export type ProjectGridQueryResult = ProjectGridItem[];
export type ProjectBySlugResult = Omit<Project, 'slug'> & { slug: string } | null;
export type SiteSettingsResult = SiteSettings | null;
export type InfoPageResult = InfoPage | null;

export interface ProjectNavItem {
  slug: string;
  title: string;
}
export type AllProjectSlugsResult = ProjectNavItem[];
