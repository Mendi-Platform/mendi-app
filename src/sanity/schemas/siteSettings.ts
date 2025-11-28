import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
    }),
    // Branding
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Main logo for the site',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'questionIcon',
      title: 'Question Icon',
      type: 'image',
      description: 'Icon for help/question button',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'cartIcon',
      title: 'Cart Icon',
      type: 'image',
      description: 'Icon for cart button',
      options: {
        hotspot: true,
      },
    }),
    // Colors
    defineField({
      name: 'primaryColor',
      title: 'Primary Color',
      type: 'string',
      description: 'Main brand color (hex)',
      initialValue: '#006EFF',
    }),
    defineField({
      name: 'primaryHoverColor',
      title: 'Primary Hover Color',
      type: 'string',
      initialValue: '#0056CC',
    }),
    defineField({
      name: 'primaryLightColor',
      title: 'Primary Light Color',
      type: 'string',
      initialValue: '#BFDAFF',
    }),
    defineField({
      name: 'textPrimaryColor',
      title: 'Text Primary Color',
      type: 'string',
      initialValue: '#242424',
    }),
    defineField({
      name: 'textSecondaryColor',
      title: 'Text Secondary Color',
      type: 'string',
      initialValue: '#797979',
    }),
    defineField({
      name: 'textDisabledColor',
      title: 'Text Disabled Color',
      type: 'string',
      initialValue: '#A7A7A7',
    }),
    defineField({
      name: 'bgDefaultColor',
      title: 'Background Default Color',
      type: 'string',
      initialValue: '#F3F3F3',
    }),
    defineField({
      name: 'borderColor',
      title: 'Border Color',
      type: 'string',
      initialValue: '#E5E5E5',
    }),
    // Checkout Steps - Localized
    defineField({
      name: 'checkoutSteps',
      title: 'Checkout Steps',
      type: 'object',
      fields: [
        { name: 'nb', title: 'Norwegian', type: 'array', of: [{ type: 'string' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
      ],
    }),
    defineField({
      name: 'deliverySteps',
      title: 'Delivery Steps',
      type: 'object',
      fields: [
        { name: 'nb', title: 'Norwegian', type: 'array', of: [{ type: 'string' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
      ],
    }),
    // Limits
    defineField({
      name: 'maxSavedAddresses',
      title: 'Max Saved Addresses',
      type: 'number',
      initialValue: 5,
    }),
    // Order Flow Configuration
    defineField({
      name: 'orderFlowConfig',
      title: 'Order Flow Configuration',
      type: 'object',
      fields: [
        {
          name: 'startStep',
          title: 'Starting Step',
          type: 'reference',
          to: [{ type: 'orderFlowStep' }],
          description: 'First step users see (/order/garment)'
        },
        {
          name: 'confirmationStep',
          title: 'Confirmation Step',
          type: 'reference',
          to: [{ type: 'orderFlowStep' }],
          description: 'Final confirmation page'
        },
        {
          name: 'allSteps',
          title: 'All Steps (for reference)',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'orderFlowStep' }] }],
          description: 'All available steps in default order'
        },
        {
          name: 'stepGroups',
          title: 'Step Groups',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'orderStepGroup' }] }],
          description: 'Ordered list of step groups'
        }
      ]
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      };
    },
  },
});
