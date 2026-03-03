import { getHomepageFrames, getSiteSettings } from '@/lib/data';
import { ProjectGrid } from '@/components/ProjectGrid';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: 'Index',
    description: settings?.seoDescription ?? 'Architecture and design portfolio.',
  };
}

/** Home = HAW-LIN style editorial grid. Curated frames from all projects. */
export default async function IndexPage() {
  const items = await getHomepageFrames();
  return (
    <div className="w-full">
      <ProjectGrid items={items} />
    </div>
  );
}
