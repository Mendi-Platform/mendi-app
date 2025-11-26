import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'postenOption',
  title: 'Posten Option',
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
      name: 'description',
      title: 'Description',
      type: 'localizedString',
      description: 'Size/weight description in both languages',
    }),
    defineField({
      name: 'price',
      title: 'Price (NOK)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
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
