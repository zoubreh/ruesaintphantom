import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'infoPage',
  title: 'Info Page',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', type: 'string', title: 'Heading' },
            { name: 'body', type: 'text', title: 'Body' },
            {
              name: 'links',
              type: 'array',
              title: 'Links',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', type: 'string', title: 'Label' },
                    { name: 'href', type: 'string', title: 'URL (mailto: or https://)' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'imprintText',
      title: 'Imprint',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'representedBy',
      title: 'Represented By',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'programmingBy',
      title: 'Programming By',
      type: 'string',
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright',
      type: 'string',
    }),
  ],
});
