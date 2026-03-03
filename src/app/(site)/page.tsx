import { getFlattenedGridItems, getSiteSettings } from '@/lib/data';
import { ImageBankGrid } from '@/components/ImageBankGrid';

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await getSiteSettings();
  return {
    title: 'Index',
    description: settings?.seoDescription ?? 'Image-first minimal portfolio.',
  };
}

/** Home = ONE continuous image bank grid. No project titles, no project cards. */
export default async function IndexPage() {
  const items = await getFlattenedGridItems();
  return (
    <div className="w-full">
      <ImageBankGrid items={items} />
    </div>
  );
}
