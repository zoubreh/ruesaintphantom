export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface MediaItem {
  _key: string;
  type: 'image' | 'video';
  image?: SanityImage;
  videoUrl?: string;
  poster?: SanityImage;
  caption?: string | null;
  credit?: string | null;
  alt?: string | null;
}

export interface ProjectCredit {
  _key?: string;
  label: string;
  value?: string | null;
  url?: string | null;
}

export interface Project {
  _id: string;
  _type: 'project';
  title: string;
  slug: { current: string };
  year?: number | null;
  client?: string | null;
  tags?: string[] | null;
  description?: string | null;
  coverImage: SanityImage;
  gallery?: MediaItem[] | null;
  indexOrder?: number | null;
  published?: boolean | null;
  credits?: ProjectCredit[] | null;
}

export interface SiteSettings {
  siteTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: SanityImage | null;
  socialLinks?: { label?: string; url?: string }[] | null;
  contactEmail?: string | null;
  footerNote?: string | null;
}

export interface InfoPage {
  sections?: { heading?: string; body?: string; links?: { label?: string; href?: string }[] }[] | null;
  imprintText?: string | null;
  representedBy?: string | null;
  address?: string | null;
  contactEmail?: string | null;
  programmingBy?: string | null;
  copyright?: string | null;
}
