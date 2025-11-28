import type { ComponentType } from 'react';

// Dynamic import type for sections - use flexible typing for dynamic imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SectionComponent = ComponentType<any>;

// Section loader registry - dynamically imports section components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SECTION_LOADERS: Record<string, () => Promise<{ default: any }>> = {
  'garment': () => import('@/components/order/sections/GarmentSection'),
  'service': () => import('@/components/order/sections/ServiceSection'),
  'category': () => import('@/components/order/sections/CategorySection'),
  'leather-type': () => import('@/components/order/sections/LeatherTypeSection'),
  'two-option': () => import('@/components/order/sections/TwoOptionSection'),
  'measurement': () => import('@/components/order/sections/MeasurementSection'),
  'measurement-details': () => import('@/components/order/sections/MeasurementDetailsSection'),
  'quantity': () => import('@/components/order/sections/QuantitySection'),
  'mark-damage': () => import('@/components/order/sections/MarkDamageSection'),
  'add-image': () => import('@/components/order/sections/AddImageSection'),
  'additional-details': () => import('@/components/order/sections/AdditionalDetailsSection'),
  'other-request-info': () => import('@/components/order/sections/OtherRequestSection'),
  'cart': () => import('@/components/order/sections/CartSection'),
  'delivery-choice': () => import('@/components/order/sections/DeliverySection'),
  'checkout': () => import('@/components/order/sections/CheckoutSection'),
  'payment': () => import('@/components/order/sections/PaymentSection'),
  'confirmation': () => import('@/components/order/sections/ConfirmationSection'),
};

// Data requirements configuration - maps slug to required Sanity queries
export const SECTION_DATA_CONFIG: Record<string, {
  queries: Array<'garments' | 'repairTypes' | 'pricing' | 'siteSettings' | 'storeLocations' | 'postenOptions' | 'deliveryOptions'>;
}> = {
  'garment': {
    queries: ['garments']
  },
  'service': {
    queries: ['repairTypes']
  },
  'cart': {
    queries: ['pricing', 'siteSettings', 'garments']
  },
  'delivery-choice': {
    queries: ['storeLocations', 'postenOptions', 'deliveryOptions', 'pricing', 'siteSettings']
  },
  'checkout': {
    queries: ['storeLocations', 'postenOptions', 'deliveryOptions', 'pricing', 'siteSettings']
  },
  'payment': {
    queries: ['storeLocations', 'postenOptions', 'deliveryOptions', 'pricing', 'siteSettings', 'garments']
  },
  'category': {
    queries: ['pricing', 'siteSettings']
  },
  'two-option': {
    queries: []
  },
  'quantity': {
    queries: []
  },
  'measurement': {
    queries: []
  },
  'measurement-details': {
    queries: []
  },
  'mark-damage': {
    queries: []
  },
  'add-image': {
    queries: []
  },
  'additional-details': {
    queries: []
  },
  'other-request-info': {
    queries: []
  },
  'leather-type': {
    queries: []
  },
  'confirmation': {
    queries: []
  }
};
