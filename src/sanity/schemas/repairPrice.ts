import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'repairPrice',
  title: 'Repair Price',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'localizedString',
      description: 'Display name in both languages',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name.nb',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (NOK)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localizedText',
      description: 'Additional description in both languages',
    }),
  ],
  preview: {
    select: {
      title: 'name.nb',
      subtitle: 'price',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Untitled',
        subtitle: `${subtitle} kr`,
      };
    },
  },
});
