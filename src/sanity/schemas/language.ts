import { defineType, defineField } from 'sanity'

// Supported languages
export const supportedLanguages = [
  { id: 'nb', title: 'Norwegian (Bokmål)', isDefault: true },
  { id: 'en', title: 'English' },
]

export const defaultLanguage = supportedLanguages.find(l => l.isDefault)?.id ?? 'nb'

export default defineType({
  name: 'language',
  title: 'Language',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Language Code',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Language Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'isDefault',
      title: 'Default Language',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      id: 'id',
      isDefault: 'isDefault',
    },
    prepare({ title, id, isDefault }) {
      return {
        title: `${title} (${id})`,
        subtitle: isDefault ? 'Default' : '',
      }
    },
  },
})
