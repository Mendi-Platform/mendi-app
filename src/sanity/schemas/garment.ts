import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'garment',
  title: 'Garment Type',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name (Internal)',
      type: 'string',
      description: 'Internal identifier (e.g., "upper_body")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Display Label',
      type: 'localizedString',
      description: 'Label shown in the UI (e.g., "Overdel" / "Upper body")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'isPremiumOnly',
      title: 'Premium Only',
      type: 'boolean',
      description: 'If true, only premium service is available for this garment',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'label.nb',
      subtitle: 'name',
      media: 'icon',
    },
  },
});
