import { redirect } from 'next/navigation';
import { getProjectBySlug, getProjectNavigation } from '@/lib/data';
import { ProjectView } from '@/components/ProjectView';

export const revalidate = 60;

export default async function ProjectModalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, allSlugs] = await Promise.all([
    getProjectBySlug(slug),
    getProjectNavigation(),
  ]);

  if (!project) redirect('/');

  const currentIndex = allSlugs.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextProject = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;

  return (
    <ProjectView
      project={project}
      isModal
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
