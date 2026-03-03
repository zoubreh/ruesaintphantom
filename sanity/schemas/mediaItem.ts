import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'mediaItem',
  title: 'Media Item',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: ['image', 'video'], layout: 'radio' },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type !== 'image',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { type?: string };
          if (parent?.type === 'image' && !value) return 'Image is required for image type';
          return true;
        }),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (Vimeo or direct MP4)',
      type: 'url',
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
    defineField({
      name: 'poster',
      title: 'Poster Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
    defineField({
      name: 'credit',
      title: 'Credit',
      type: 'string',
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      description: 'Recommended for accessibility',
    }),
  ],
  preview: {
    select: {
      type: 'type',
      media: 'image',
      caption: 'caption',
    },
    prepare({ type, media, caption }) {
      return {
        title: caption || (type === 'image' ? 'Image' : 'Video'),
        media,
      };
    },
  },
});
