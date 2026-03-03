import { getFlattenedGridItems } from '@/lib/data';
import { ImageBankGrid } from '@/components/ImageBankGrid';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'Index',
    description: 'Image-first minimal portfolio.',
  };
}

export default async function IndexPage() {
  const items = await getFlattenedGridItems();
  return <ImageBankGrid items={items} />;
}
