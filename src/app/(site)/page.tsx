import { getProjectsForGrid, getSiteSettings } from '@/lib/data';
import { ProjectGrid } from '@/components/ProjectGrid';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: 'Index',
    description: settings?.seoDescription ?? 'Architecture and design portfolio.',
  };
}

/** Home = Editorial project grid. One cover per project, asymmetric sizes. */
export default async function IndexPage() {
  const items = await getProjectsForGrid();
  return (
    <div className="w-full">
      <ProjectGrid items={items} />
    </div>
  );
}
