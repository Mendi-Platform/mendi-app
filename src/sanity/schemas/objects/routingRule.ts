import { defineType } from 'sanity';

export default defineType({
  name: 'routingRule',
  title: 'Routing Rule',
  type: 'object',
  fields: [
    {
      name: 'conditions',
      title: 'Conditions (ALL must match)',
      type: 'array',
      of: [{ type: 'routingCondition' }],
      description: 'All conditions must be true for this rule to apply'
    },
    {
      name: 'nextStep',
      title: 'Next Step',
      type: 'reference',
      to: [{ type: 'orderFlowStep' }],
      description: 'Go to this step if conditions match'
    },
    {
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description: 'Higher number = evaluated first',
      initialValue: 0
    },
    {
      name: 'description',
      title: 'Rule Description',
      type: 'string',
      description: 'Human-readable explanation of this rule'
    }
  ],
  preview: {
    select: {
      priority: 'priority',
      description: 'description'
    },
    prepare({ priority, description }) {
      return {
        title: description || 'Routing Rule',
        subtitle: `Priority: ${priority}`
      };
    }
  }
});
