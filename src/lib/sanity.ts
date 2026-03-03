import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../../sanity/env';

if (!projectId) {
  console.warn('Missing NEXT_PUBLIC_SANITY_PROJECT_ID — Sanity queries will fail.');
}

export const client = createClient({
  projectId: projectId || 'missing-project-id',
  dataset: dataset || 'production',
  apiVersion: apiVersion || '2024-01-01',
  useCdn: true,
});
