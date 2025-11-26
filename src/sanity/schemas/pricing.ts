import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'pricing',
  title: 'Pricing Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'standardPrice',
      title: 'Standard Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'premiumPrice',
      title: 'Premium Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'premiumAddon',
      title: 'Premium Addon Price',
      type: 'number',
      description: 'Additional cost for premium service',
    }),
    defineField({
      name: 'staticItemPrice',
      title: 'Static Item Price',
      type: 'number',
      description: 'Default price for static cart items',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Pricing Configuration',
      };
    },
  },
});
