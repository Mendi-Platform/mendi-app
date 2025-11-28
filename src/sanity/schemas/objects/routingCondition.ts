import { defineType } from 'sanity';

export default defineType({
  name: 'routingCondition',
  title: 'Routing Condition',
  type: 'object',
  fields: [
    {
      name: 'formField',
      title: 'Form Field',
      type: 'string',
      options: {
        list: [
          { title: 'Garment Type', value: 'garmentSlug' },
          { title: 'Repair Type', value: 'repairTypeSlug' },
          { title: 'Category', value: 'categorySlug' },
          { title: 'Leather Type', value: 'leatherTypeSlug' },
          { title: 'Material', value: 'materialSlug' }
        ]
      }
    },
    {
      name: 'operator',
      title: 'Operator',
      type: 'string',
      options: {
        list: [
          { title: 'Equals', value: 'equals' },
          { title: 'Is one of', value: 'in' },
          { title: 'Not equals', value: 'notEquals' },
          { title: 'Is not one of', value: 'notIn' },
          { title: 'Is empty', value: 'isEmpty' },
          { title: 'Is not empty', value: 'isNotEmpty' }
        ]
      }
    },
    {
      name: 'values',
      title: 'Value(s)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Values to match (not needed for isEmpty/isNotEmpty)',
      hidden: ({ parent }) =>
        parent?.operator === 'isEmpty' || parent?.operator === 'isNotEmpty'
    }
  ]
});
