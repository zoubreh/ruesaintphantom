import { notFound } from 'next/navigation';
import { getProjectBySlug, getIndexProjects, getSiteSettings } from '@/lib/data';
import { urlFor } from '@/lib/image';
import { ProjectView } from '@/components/ProjectView';

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getIndexProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const settings = await getSiteSettings();
  if (!project) return { title: 'Project' };
  const title = project.title;
  const ogImage = project.coverImage
    ? urlFor(project.coverImage)?.width(1200).height(630).fit('fill').url() ?? null
    : settings?.ogImage
      ? urlFor(settings.ogImage)?.width(1200).height(630).fit('fill').url() ?? null
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
