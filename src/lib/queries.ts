import type { Project, SiteSettings, InfoPage } from '@/types/sanity';

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
  gallery,
  indexOrder,
  published,
  credits
`;

/** Projects for index (published only, ordered by indexOrder). */
export const indexProjectsQuery = `*[_type == "project" && published == true] | order(indexOrder asc) {
  ${projectFields}
}`;

/** Home: per-project items (cover + gallery). Flatten in app to one array. Each item: projectSlug, projectTitle, year, client, image. */
export const homeGridQuery = `*[_type == "project" && published == true] | order(indexOrder asc) {
  "items": [
    { "id": _id + "-cover", "projectSlug": slug.current, "projectTitle": title, "year": year, "client": client, "type": "image", "image": coverImage, "alt": title },
    ...(gallery[] {
      "id": _id + "-" + _key,
      "projectSlug": slug.current,
      "projectTitle": title,
      "year": year,
      "client": client,
      "type": type,
      "image": select(type == "image" => image, type == "video" => poster),
      "alt": alt
    })
  ]
}`;

/** B) Project by slug: project meta + ordered gallery (array order = display order). */
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
export type ProjectBySlugResult = Omit<Project, 'slug'> & { slug: string } | null;
export type SiteSettingsResult = SiteSettings | null;
export type InfoPageResult = InfoPage | null;

/** One project's chunk for home grid: cover + gallery items in order. Flatten with flatMap(project => project.items). */
export interface HomeGridItemResult {
  id: string;
  projectSlug: string;
  projectTitle: string;
  year?: number | null;
  client?: string | null;
  type: 'image' | 'video';
  image: Project['coverImage'] | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
  videoUrl?: string | null;
}
export type HomeGridQueryResult = { items: HomeGridItemResult[] }[];
