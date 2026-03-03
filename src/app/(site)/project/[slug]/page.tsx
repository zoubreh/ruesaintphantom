import { notFound } from 'next/navigation';
import { getProjectBySlug, getSiteSettings } from '@/lib/data';
import { buildImageUrl } from '@/lib/image';
import { ProjectView } from '@/components/ProjectView';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const settings = await getSiteSettings();
  if (!project) return { title: 'Project' };
  const title = project.title;
  const ogImage = project.coverImage
    ? buildImageUrl(project.coverImage, { width: 1200, height: 630, fit: 'fill' })
    : settings?.ogImage
      ? buildImageUrl(settings.ogImage, { width: 1200, height: 630, fit: 'fill' })
      : null;
  return {
    title,
    description: project.description ?? undefined,
    openGraph: {
      title,
      description: project.description ?? undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  return <ProjectView project={project} isModal={false} />;
}
