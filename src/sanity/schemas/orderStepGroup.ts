import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'orderStepGroup',
  title: 'Order Step Group',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Internal Name',
      type: 'string',
      description: 'For reference (e.g., "Order Details")'
    }),
    defineField({
      name: 'label',
      title: 'Display Label',
      type: 'object',
      fields: [
        { name: 'nb', type: 'string', title: 'Norwegian' },
        { name: 'en', type: 'string', title: 'English' }
      ]
    }),
    defineField({
      name: 'order',
      title: 'Group Order',
      type: 'number',
      description: 'Display order (1, 2, 3...)'
    }),
    defineField({
      name: 'color',
      title: 'Group Color',
      type: 'string',
      description: 'Optional color for visual distinction'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'order'
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: `Group ${subtitle}`
      };
    }
  }
});
