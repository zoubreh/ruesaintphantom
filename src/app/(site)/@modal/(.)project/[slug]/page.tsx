import { getProjectBySlug } from '@/lib/data';
import { ProjectView } from '@/components/ProjectView';

export const revalidate = 60;

export default async function ProjectModalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return null;
  return <ProjectView project={project} isModal />;
}
