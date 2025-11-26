import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'repairType',
  title: 'Repair Type',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name (Internal)',
      type: 'string',
      description: 'Internal identifier (e.g., "replace_zipper")',
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
      description: 'Label shown in the UI (e.g., "Bytte glidelås" / "Replace zipper")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'localizedText',
      description: 'Additional description in both languages',
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
      title: 'label.nb',
      subtitle: 'name',
    },
  },
});
