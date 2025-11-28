import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'orderFlowStep',
  title: 'Order Flow Step',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      description: 'URL path (e.g., "garment", "service")',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'label',
      title: 'Step Label',
      type: 'object',
      fields: [
        { name: 'nb', type: 'string', title: 'Norwegian' },
        { name: 'en', type: 'string', title: 'English' }
      ]
    }),
    defineField({
      name: 'stepGroupId',
      title: 'Step Group',
      type: 'reference',
      to: [{ type: 'orderStepGroup' }],
      description: 'Which group this step belongs to'
    }),
    defineField({
      name: 'defaultOrder',
      title: 'Default Display Order',
      type: 'number',
      description: 'Base order (can be overridden by routing rules)'
    }),
    defineField({
      name: 'componentType',
      title: 'Component Type',
      type: 'string',
      description: 'Must match the component key in orderComponentRegistry.ts',
      options: {
        list: [
          { title: 'Garment Selection', value: 'garment' },
          { title: 'Service Selection', value: 'service' },
          { title: 'Category', value: 'category' },
          { title: 'Leather Type', value: 'leather-type' },
          { title: 'Two Options', value: 'two-option' },
          { title: 'Measurement', value: 'measurement' },
          { title: 'Measurement Details', value: 'measurement-details' },
          { title: 'Quantity', value: 'quantity' },
          { title: 'Mark Damage', value: 'mark-damage' },
          { title: 'Add Image', value: 'add-image' },
          { title: 'Additional Details', value: 'additional-details' },
          { title: 'Other Request', value: 'other-request-info' },
          { title: 'Cart', value: 'cart' },
          { title: 'Delivery Choice', value: 'delivery-choice' },
          { title: 'Checkout', value: 'checkout' },
          { title: 'Payment', value: 'payment' },
          { title: 'Confirmation', value: 'confirmation' }
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'nextStepRules',
      title: 'Next Step Routing Rules',
      type: 'array',
      of: [{ type: 'routingRule' }],
      description: 'Conditional rules to determine next step'
    }),
    defineField({
      name: 'defaultNextStep',
      title: 'Default Next Step',
      type: 'reference',
      to: [{ type: 'orderFlowStep' }],
      description: 'Fallback if no rules match'
    }),
    defineField({
      name: 'isOptional',
      title: 'Is Optional Step',
      type: 'boolean',
      initialValue: false,
      description: 'Can this step be skipped?'
    }),
    defineField({
      name: 'skipConditions',
      title: 'Skip Conditions',
      type: 'array',
      of: [{ type: 'routingCondition' }],
      description: 'If any condition matches, skip this step'
    })
  ],
  preview: {
    select: {
      title: 'label.nb',
      subtitle: 'slug.current'
    }
  }
});
