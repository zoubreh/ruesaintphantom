import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  orderings: [
    { title: 'Index Order', name: 'indexOrderAsc', by: [{ field: 'indexOrder', direction: 'asc' }] },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'mediaItem' }],
    }),
    defineField({
      name: 'homeFrames',
      title: 'Homepage Frames',
      type: 'array',
      description: 'Pick which images from this project appear on the homepage, and choose their size. Drag to reorder.',
      of: [
        {
          type: 'object',
          name: 'homeFrame',
          fields: [
            {
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'gridSize',
              type: 'string',
              title: 'Grid Size',
              options: {
                list: [
                  { title: 'S — Small (1x1)', value: 'S' },
                  { title: 'M — Medium (2x1)', value: 'M' },
                  { title: 'L — Large (2x2)', value: 'L' },
                  { title: 'TALL — Tall (1x2)', value: 'TALL' },
                  { title: 'WIDE — Wide (2x1)', value: 'WIDE' },
                ],
                layout: 'radio',
              },
              initialValue: 'M',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text (optional)',
            },
          ],
          preview: {
            select: { media: 'image', size: 'gridSize' },
            prepare({ media, size }) {
              return { title: `Frame — ${size || 'M'}`, media };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'indexOrder',
      title: 'Index Order',
      type: 'number',
      description: 'Lower number = higher on index. Use drag & drop in list to reorder.',
      initialValue: 0,
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required() },
            { name: 'value', type: 'string', title: 'Value' },
            { name: 'url', type: 'url', title: 'Link (optional)' },
          ],
          preview: {
            select: { label: 'label', value: 'value' },
            prepare({ label, value }) {
              return { title: label || value || 'Credit' };
            },
          },
        },
      ],
      description: 'Photography, Set design, etc.',
    }),
  ],
  preview: {
    select: { title: 'title', media: 'coverImage', published: 'published' },
    prepare({ title, media, published }) {
      return {
        title: [title, !published ? '(unpublished)' : ''].filter(Boolean).join(' '),
        media,
      };
    },
  },
});
