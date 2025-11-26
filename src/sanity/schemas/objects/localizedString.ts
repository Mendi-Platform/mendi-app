import { defineType, defineField } from 'sanity'
import { supportedLanguages } from '../language'

export default defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  fields: supportedLanguages.map(lang =>
    defineField({
      name: lang.id,
      title: lang.title,
      type: 'string',
    })
  ),
})
