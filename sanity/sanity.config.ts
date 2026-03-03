import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: 'ruesaintphantom',
  title: 'RUESAINTPHANTOM',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({
      // Singletons: one doc per type via documentId. Projects: ordered by indexOrder (drag in list to reorder).
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.listItem()
              .title('Info Page')
              .child(S.document().schemaType('infoPage').documentId('infoPage')),
            S.divider(),
            S.listItem()
              .title('Projects')
              .child(
                S.documentTypeList('project')
                  .title('Projects')
                  .filter('_type == "project"')
                  .defaultOrdering([{ field: 'indexOrder', direction: 'asc' }])
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
