/**
 * Seed script for Order Flow data in Sanity
 *
 * This script creates:
 * 1. Order Step Groups (categories of steps)
 * 2. Order Flow Steps (individual steps with routing rules)
 * 3. Updates Site Settings with the order flow configuration
 *
 * Run with: npx ts-node --esm scripts/seedOrderFlow.ts
 * Or: npx tsx scripts/seedOrderFlow.ts
 */

import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables (try .env.local first, then .env)
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_READ_AND_WRITE_TOKEN || process.env.SANITY_EDITOR_TOKEN;

if (!projectId || !dataset) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET');
  process.exit(1);
}

if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN - you need a write token to seed data');
  console.error('Create one at: https://www.sanity.io/manage/project/' + projectId + '/api#tokens');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-11-26',
  token,
  useCdn: false,
});

// Step Group definitions
interface StepGroupDef {
  _id: string;
  _type: 'orderStepGroup';
  name: string;
  label: { nb: string; en: string };
  order: number;
  color?: string;
}

const stepGroups: StepGroupDef[] = [
  {
    _id: 'group-order-details',
    _type: 'orderStepGroup',
    name: 'Order Details',
    label: { nb: 'Bestillingsdetaljer', en: 'Order Details' },
    order: 1,
    color: '#006EFF'
  },
  {
    _id: 'group-customization',
    _type: 'orderStepGroup',
    name: 'Customization',
    label: { nb: 'Tilpasning', en: 'Customization' },
    order: 2,
    color: '#00B894'
  },
  {
    _id: 'group-cart-checkout',
    _type: 'orderStepGroup',
    name: 'Cart & Checkout',
    label: { nb: 'Handlekurv og betaling', en: 'Cart & Checkout' },
    order: 3,
    color: '#E17055'
  }
];

// Step definitions with routing
interface RoutingConditionDef {
  _type: 'routingCondition';
  _key: string;
  formField: string;
  operator: string;
  values?: string[];
}

interface RoutingRuleDef {
  _type: 'routingRule';
  _key: string;
  conditions: RoutingConditionDef[];
  nextStep: { _type: 'reference'; _ref: string };
  priority: number;
  description: string;
}

interface OrderFlowStepDef {
  _id: string;
  _type: 'orderFlowStep';
  slug: { _type: 'slug'; current: string };
  label: { nb: string; en: string };
  stepGroupId: { _type: 'reference'; _ref: string };
  defaultOrder: number;
  componentType: string;
  isOptional: boolean;
  nextStepRules?: RoutingRuleDef[];
  skipConditions?: RoutingConditionDef[];
  defaultNextStep?: { _type: 'reference'; _ref: string };
}

const orderFlowSteps: OrderFlowStepDef[] = [
  // ===== Group 1: Order Details =====
  {
    _id: 'step-garment',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'garment' },
    label: { nb: 'Plagg', en: 'Garment' },
    stepGroupId: { _type: 'reference', _ref: 'group-order-details' },
    defaultOrder: 1,
    componentType: 'garment',
    isOptional: false,
    defaultNextStep: { _type: 'reference', _ref: 'step-service' }
  },
  {
    _id: 'step-service',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'service' },
    label: { nb: 'Tjeneste', en: 'Service' },
    stepGroupId: { _type: 'reference', _ref: 'group-order-details' },
    defaultOrder: 2,
    componentType: 'service',
    isOptional: false,
    nextStepRules: [
      {
        _type: 'routingRule',
        _key: 'rule-zipper-hole',
        conditions: [
          {
            _type: 'routingCondition',
            _key: 'cond-repair-type',
            formField: 'repairTypeSlug',
            operator: 'in',
            values: ['replace-zipper', 'hole']
          }
        ],
        nextStep: { _type: 'reference', _ref: 'step-two-option' },
        priority: 10,
        description: 'Zipper/hole repairs go to two-option page'
      },
      {
        _type: 'routingRule',
        _key: 'rule-leather',
        conditions: [
          {
            _type: 'routingCondition',
            _key: 'cond-garment-leather',
            formField: 'garmentSlug',
            operator: 'in',
            values: ['leather-jacket', 'leather-pants', 'leather-bag']
          }
        ],
        nextStep: { _type: 'reference', _ref: 'step-leather-type' },
        priority: 8,
        description: 'Leather items go to leather type selection'
      },
      {
        _type: 'routingRule',
        _key: 'rule-hemming',
        conditions: [
          {
            _type: 'routingCondition',
            _key: 'cond-hemming',
            formField: 'repairTypeSlug',
            operator: 'equals',
            values: ['hemming']
          }
        ],
        nextStep: { _type: 'reference', _ref: 'step-measurement' },
        priority: 9,
        description: 'Hemming repairs go to measurement'
      }
    ],
    defaultNextStep: { _type: 'reference', _ref: 'step-category' }
  },
  {
    _id: 'step-category',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'category' },
    label: { nb: 'Kategori', en: 'Category' },
    stepGroupId: { _type: 'reference', _ref: 'group-order-details' },
    defaultOrder: 3,
    componentType: 'category',
    isOptional: true,
    defaultNextStep: { _type: 'reference', _ref: 'step-cart' }
  },
  {
    _id: 'step-leather-type',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'leather-type' },
    label: { nb: 'Skinntype', en: 'Leather Type' },
    stepGroupId: { _type: 'reference', _ref: 'group-order-details' },
    defaultOrder: 4,
    componentType: 'leather-type',
    isOptional: true,
    skipConditions: [
      {
        _type: 'routingCondition',
        _key: 'skip-non-leather',
        formField: 'garmentSlug',
        operator: 'notIn',
        values: ['leather-jacket', 'leather-pants', 'leather-bag']
      }
    ],
    defaultNextStep: { _type: 'reference', _ref: 'step-cart' }
  },

  // ===== Group 2: Customization =====
  {
    _id: 'step-two-option',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'two-option' },
    label: { nb: 'Valg', en: 'Options' },
    stepGroupId: { _type: 'reference', _ref: 'group-customization' },
    defaultOrder: 5,
    componentType: 'two-option',
    isOptional: true,
    defaultNextStep: { _type: 'reference', _ref: 'step-quantity' }
  },
  {
    _id: 'step-measurement',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'measurement' },
    label: { nb: 'Mål', en: 'Measurement' },
    stepGroupId: { _type: 'reference', _ref: 'group-customization' },
    defaultOrder: 6,
    componentType: 'measurement',
    isOptional: true,
    skipConditions: [
      {
        _type: 'routingCondition',
        _key: 'skip-non-hemming',
        formField: 'repairTypeSlug',
        operator: 'notEquals',
        values: ['hemming']
      }
    ],
    defaultNextStep: { _type: 'reference', _ref: 'step-measurement-details' }
  },
  {
    _id: 'step-measurement-details',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'measurement-details' },
    label: { nb: 'Måldetaljer', en: 'Measurement Details' },
    stepGroupId: { _type: 'reference', _ref: 'group-customization' },
    defaultOrder: 7,
    componentType: 'measurement-details',
    isOptional: true,
    defaultNextStep: { _type: 'reference', _ref: 'step-cart' }
  },
  {
    _id: 'step-quantity',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'quantity' },
    label: { nb: 'Antall', en: 'Quantity' },
    stepGroupId: { _type: 'reference', _ref: 'group-customization' },
    defaultOrder: 8,
    componentType: 'quantity',
    isOptional: true,
    defaultNextStep: { _type: 'reference', _ref: 'step-mark-damage' }
  },
  {
    _id: 'step-mark-damage',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'mark-damage' },
    label: { nb: 'Merk skade', en: 'Mark Damage' },
    stepGroupId: { _type: 'reference', _ref: 'group-customization' },
    defaultOrder: 9,
    componentType: 'mark-damage',
    isOptional: true,
    defaultNextStep: { _type: 'reference', _ref: 'step-add-image' }
  },
  {
    _id: 'step-add-image',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'add-image' },
    label: { nb: 'Legg til bilde', en: 'Add Image' },
    stepGroupId: { _type: 'reference', _ref: 'group-customization' },
    defaultOrder: 10,
    componentType: 'add-image',
    isOptional: true,
    defaultNextStep: { _type: 'reference', _ref: 'step-additional-details' }
  },
  {
    _id: 'step-additional-details',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'additional-details' },
    label: { nb: 'Tilleggsinfo', en: 'Additional Details' },
    stepGroupId: { _type: 'reference', _ref: 'group-customization' },
    defaultOrder: 11,
    componentType: 'additional-details',
    isOptional: true,
    defaultNextStep: { _type: 'reference', _ref: 'step-cart' }
  },
  {
    _id: 'step-other-request-info',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'other-request-info' },
    label: { nb: 'Annen forespørsel', en: 'Other Request' },
    stepGroupId: { _type: 'reference', _ref: 'group-customization' },
    defaultOrder: 12,
    componentType: 'other-request-info',
    isOptional: true,
    defaultNextStep: { _type: 'reference', _ref: 'step-cart' }
  },

  // ===== Group 3: Cart & Checkout =====
  {
    _id: 'step-cart',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'cart' },
    label: { nb: 'Handlekurv', en: 'Cart' },
    stepGroupId: { _type: 'reference', _ref: 'group-cart-checkout' },
    defaultOrder: 13,
    componentType: 'cart',
    isOptional: false,
    defaultNextStep: { _type: 'reference', _ref: 'step-delivery-choice' }
  },
  {
    _id: 'step-delivery-choice',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'delivery-choice' },
    label: { nb: 'Leveringsvalg', en: 'Delivery Choice' },
    stepGroupId: { _type: 'reference', _ref: 'group-cart-checkout' },
    defaultOrder: 14,
    componentType: 'delivery-choice',
    isOptional: false,
    defaultNextStep: { _type: 'reference', _ref: 'step-checkout' }
  },
  {
    _id: 'step-checkout',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'checkout' },
    label: { nb: 'Kasse', en: 'Checkout' },
    stepGroupId: { _type: 'reference', _ref: 'group-cart-checkout' },
    defaultOrder: 15,
    componentType: 'checkout',
    isOptional: false,
    defaultNextStep: { _type: 'reference', _ref: 'step-payment' }
  },
  {
    _id: 'step-payment',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'payment' },
    label: { nb: 'Betaling', en: 'Payment' },
    stepGroupId: { _type: 'reference', _ref: 'group-cart-checkout' },
    defaultOrder: 16,
    componentType: 'payment',
    isOptional: false,
    defaultNextStep: { _type: 'reference', _ref: 'step-confirmation' }
  },
  {
    _id: 'step-confirmation',
    _type: 'orderFlowStep',
    slug: { _type: 'slug', current: 'confirmation' },
    label: { nb: 'Bekreftelse', en: 'Confirmation' },
    stepGroupId: { _type: 'reference', _ref: 'group-cart-checkout' },
    defaultOrder: 17,
    componentType: 'confirmation',
    isOptional: false
    // No defaultNextStep - this is the final step
  }
];

async function seedData() {
  console.log('🌱 Starting Order Flow seed...\n');

  // Step 1: Delete existing data (optional - uncomment if you want to reset)
  console.log('🗑️  Cleaning up existing order flow data...');

  try {
    // Delete existing step groups
    const existingGroups = await client.fetch(`*[_type == "orderStepGroup"]._id`);
    if (existingGroups.length > 0) {
      const groupTransaction = client.transaction();
      existingGroups.forEach((id: string) => groupTransaction.delete(id));
      await groupTransaction.commit();
      console.log(`   Deleted ${existingGroups.length} existing step groups`);
    }

    // Delete existing steps
    const existingSteps = await client.fetch(`*[_type == "orderFlowStep"]._id`);
    if (existingSteps.length > 0) {
      const stepTransaction = client.transaction();
      existingSteps.forEach((id: string) => stepTransaction.delete(id));
      await stepTransaction.commit();
      console.log(`   Deleted ${existingSteps.length} existing steps`);
    }
  } catch (error) {
    console.log('   No existing data to clean up');
  }

  // Step 2: Create Step Groups
  console.log('\n📁 Creating Step Groups...');
  const groupTransaction = client.transaction();

  for (const group of stepGroups) {
    groupTransaction.createOrReplace(group);
    console.log(`   ✓ ${group.name}`);
  }

  await groupTransaction.commit();
  console.log(`   Created ${stepGroups.length} step groups`);

  // Step 3: Create Order Flow Steps
  console.log('\n📋 Creating Order Flow Steps...');
  const stepTransaction = client.transaction();

  for (const step of orderFlowSteps) {
    stepTransaction.createOrReplace(step);
    console.log(`   ✓ ${step.slug.current} (${step.label.en})`);
  }

  await stepTransaction.commit();
  console.log(`   Created ${orderFlowSteps.length} order flow steps`);

  // Step 4: Update Site Settings with Order Flow Config
  console.log('\n⚙️  Updating Site Settings...');

  // First, check if siteSettings exists
  const existingSettings = await client.fetch(`*[_type == "siteSettings"][0]._id`);

  const orderFlowConfig = {
    startStep: { _type: 'reference' as const, _ref: 'step-garment' },
    confirmationStep: { _type: 'reference' as const, _ref: 'step-confirmation' },
    allSteps: orderFlowSteps.map(step => ({
      _type: 'reference' as const,
      _ref: step._id,
      _key: step._id
    })),
    stepGroups: stepGroups.map(group => ({
      _type: 'reference' as const,
      _ref: group._id,
      _key: group._id
    }))
  };

  if (existingSettings) {
    await client
      .patch(existingSettings)
      .set({ orderFlowConfig })
      .commit();
    console.log('   ✓ Updated existing Site Settings with order flow config');
  } else {
    await client.create({
      _type: 'siteSettings',
      title: 'Mendi App Settings',
      orderFlowConfig
    });
    console.log('   ✓ Created new Site Settings with order flow config');
  }

  console.log('\n✅ Order Flow seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   • ${stepGroups.length} Step Groups`);
  console.log(`   • ${orderFlowSteps.length} Order Flow Steps`);
  console.log(`   • Site Settings updated with flow configuration`);
  console.log('\n🔗 Your order flow now starts at: /order/garment');
}

// Run the seed
seedData().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
