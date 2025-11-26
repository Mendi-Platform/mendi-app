import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'deliveryOption',
  title: 'Delivery Option',
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
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Pickup Point', value: 'pickup_point' },
          { title: 'Meet Tailor', value: 'syer' },
          { title: 'Posten', value: 'posten' },
        ],
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
      description: 'Description shown to users in both languages',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
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
      subtitle: 'type',
      media: 'logo',
    },
  },
});
