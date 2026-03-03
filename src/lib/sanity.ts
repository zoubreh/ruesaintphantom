import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '../../sanity/env';

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset: dataset || 'production',
  apiVersion: apiVersion || '2024-01-01',
  useCdn: true,
});

