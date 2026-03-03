import { getIndexProjects } from '@/lib/data';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ruesaintphantom.com';

export default async function sitemap() {
  const projects = await getIndexProjects();
  const projectUrls = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/info`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    ...projectUrls,
  ];
}
