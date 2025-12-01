import type {
  OrderFlowStepExpanded,
  SanityDeliveryOption,
  SanityGarment,
  SanityOrderStepGroup,
  SanityPostenOption,
  SanityPricing,
  SanityRepairType,
  SanitySiteSettings,
  SanityStoreLocation,
} from '@/sanity/lib/types';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const stepGroups: SanityOrderStepGroup[] = [
  {
    _id: 'group-details',
    name: 'details',
    label: { nb: 'Detaljer', en: 'Details' },
    order: 1,
    color: '#006EFF',
  },
  {
    _id: 'group-checkout',
    name: 'checkout',
    label: { nb: 'Kasse', en: 'Checkout' },
    order: 2,
    color: '#006EFF',
  },
];

const orderFlowSteps: OrderFlowStepExpanded[] = [
  {
    _id: 'step-garment',
    slug: { current: 'garment' },
    label: { nb: 'Plagg', en: 'Garment' },
    stepGroupId: { _ref: stepGroups[0]._id, _type: 'reference' },
    stepGroup: stepGroups[0],
    defaultOrder: 1,
    componentType: 'garment',
    isOptional: false,
    skipConditions: [],
    nextStepRules: [],
    defaultNextStepSlug: 'service',
  },
  {
    _id: 'step-service',
    slug: { current: 'service' },
    label: { nb: 'Tjeneste', en: 'Service' },
    stepGroupId: { _ref: stepGroups[0]._id, _type: 'reference' },
    stepGroup: stepGroups[0],
    defaultOrder: 2,
    componentType: 'service',
    isOptional: false,
    skipConditions: [],
    nextStepRules: [],
    defaultNextStepSlug: 'category',
  },
  {
    _id: 'step-category',
    slug: { current: 'category' },
    label: { nb: 'Kategori', en: 'Category' },
    stepGroupId: { _ref: stepGroups[0]._id, _type: 'reference' },
    stepGroup: stepGroups[0],
    defaultOrder: 3,
    componentType: 'category',
    isOptional: false,
    skipConditions: [],
    nextStepRules: [],
    defaultNextStepSlug: 'cart',
  },
  {
    _id: 'step-cart',
    slug: { current: 'cart' },
    label: { nb: 'Handlekurv', en: 'Cart' },
    stepGroupId: { _ref: stepGroups[0]._id, _type: 'reference' },
    stepGroup: stepGroups[0],
    defaultOrder: 4,
    componentType: 'cart',
    isOptional: false,
    skipConditions: [],
    nextStepRules: [],
    defaultNextStepSlug: 'checkout',
  },
  {
    _id: 'step-checkout',
    slug: { current: 'checkout' },
    label: { nb: 'Kasse', en: 'Checkout' },
    stepGroupId: { _ref: stepGroups[1]._id, _type: 'reference' },
    stepGroup: stepGroups[1],
    defaultOrder: 5,
    componentType: 'checkout',
    isOptional: false,
    skipConditions: [],
    nextStepRules: [],
    defaultNextStepSlug: 'payment',
  },
  {
    _id: 'step-payment',
    slug: { current: 'payment' },
    label: { nb: 'Betaling', en: 'Payment' },
    stepGroupId: { _ref: stepGroups[1]._id, _type: 'reference' },
    stepGroup: stepGroups[1],
    defaultOrder: 6,
    componentType: 'payment',
    isOptional: false,
    skipConditions: [],
    nextStepRules: [],
    defaultNextStepSlug: 'confirmation',
  },
  {
    _id: 'step-confirmation',
    slug: { current: 'confirmation' },
    label: { nb: 'Bekreftelse', en: 'Confirmation' },
    stepGroupId: { _ref: stepGroups[1]._id, _type: 'reference' },
    stepGroup: stepGroups[1],
    defaultOrder: 7,
    componentType: 'confirmation',
    isOptional: false,
    skipConditions: [],
    nextStepRules: [],
    defaultNextStepSlug: undefined,
  },
];

const pricing: SanityPricing = {
  standardPrice: 399,
  premiumPrice: 499,
  premiumAddon: 100,
  staticItemPrice: 199,
};

const siteSettings: SanitySiteSettings = {
  logo: '/mendi-app.svg',
  questionIcon: '/globe.svg',
  cartIcon: '/window.svg',
  primaryColor: '#006EFF',
  primaryHoverColor: '#0056CC',
  primaryLightColor: '#BFDAFF',
  textPrimaryColor: '#242424',
  textSecondaryColor: '#797979',
  textDisabledColor: '#A7A7A7',
  bgDefaultColor: '#F3F3F3',
  borderColor: '#E5E5E5',
  checkoutSteps: {
    nb: ['Handlekurv', 'Adresse', 'Levering', 'Betaling'],
    en: ['Cart', 'Address', 'Delivery', 'Payment'],
  },
  deliverySteps: {
    nb: ['Adresse', 'Levering', 'Betaling'],
    en: ['Address', 'Delivery', 'Payment'],
  },
  maxSavedAddresses: 5,
};

const garments: SanityGarment[] = [
  {
    _id: 'garment-upper-body',
    name: 'upper_body',
    slug: { current: 'upper-body' },
    label: { nb: 'Overdel', en: 'Upper body' },
    icon: '/image-placeholder.svg',
    order: 1,
    isPremiumOnly: false,
  },
  {
    _id: 'garment-lower-body',
    name: 'lower_body',
    slug: { current: 'lower-body' },
    label: { nb: 'Underdel', en: 'Lower body' },
    icon: '/image-placeholder.svg',
    order: 2,
    isPremiumOnly: false,
  },
  {
    _id: 'garment-outer-wear',
    name: 'outer_wear',
    slug: { current: 'outer-wear' },
    label: { nb: 'Jakke/Yttertøy', en: 'Jacket/Outerwear' },
    icon: '/image-placeholder.svg',
    order: 3,
    isPremiumOnly: true,
  },
];

const repairTypes: SanityRepairType[] = [
  {
    _id: 'repair-zipper',
    name: 'replace_zipper',
    slug: { current: 'replace-zipper' },
    label: { nb: 'Bytte glidelås', en: 'Replace zipper' },
    description: { nb: 'Bytte glidelås', en: 'Replace zipper' },
    order: 1,
  },
  {
    _id: 'repair-hemming',
    name: 'hemming',
    slug: { current: 'hemming' },
    label: { nb: 'Legge opp', en: 'Hemming' },
    description: { nb: 'Legg opp bukse eller skjørt', en: 'Hem pants or skirt' },
    order: 2,
  },
  {
    _id: 'repair-other',
    name: 'other_request',
    slug: { current: 'other-request' },
    label: { nb: 'Annet', en: 'Other' },
    description: { nb: 'Annet', en: 'Other' },
    order: 3,
  },
];

const storeLocations: SanityStoreLocation[] = [
  {
    _id: 'store-grunerlokka',
    name: 'Grünerløkka, Oslo',
    address: 'Raw Denim & Vintage Jeans',
    city: 'Oslo',
    price: 0,
    order: 1,
  },
  {
    _id: 'store-bergen',
    name: 'Sentrum, Bergen',
    address: 'The Second Hand',
    city: 'Bergen',
    price: 0,
    order: 2,
  },
];

const postenOptions: SanityPostenOption[] = [
  {
    _id: 'posten-small',
    name: { nb: 'Lite 0-5 kg', en: 'Small 0-5 kg' },
    description: { nb: 'Tur + retur', en: 'Round trip' },
    price: 158,
    order: 1,
  },
  {
    _id: 'posten-large',
    name: { nb: 'Stor 0-10 kg', en: 'Large 0-10 kg' },
    description: { nb: 'Tur + retur', en: 'Round trip' },
    price: 198,
    order: 2,
  },
];

const deliveryOptions: SanityDeliveryOption[] = [
  {
    _id: 'delivery-pickup',
    name: { nb: 'Drop-off i butikk', en: 'Drop-off at store' },
    type: 'pickup_point',
    price: 0,
    description: { nb: 'Lever plagget i butikk', en: 'Deliver in store' },
    order: 1,
  },
  {
    _id: 'delivery-syer',
    name: { nb: 'Møt syer', en: 'Meet tailor' },
    type: 'syer',
    price: 99,
    description: { nb: 'Møt syer lokalt', en: 'Meet local tailor' },
    order: 2,
  },
  {
    _id: 'delivery-posten',
    name: { nb: 'Posten', en: 'Posten' },
    type: 'posten',
    price: 158,
    description: { nb: 'Send med posten', en: 'Send by mail' },
    order: 3,
  },
];

const orderFlow = {
  orderFlowConfig: {
    startStepSlug: 'garment',
    confirmationStepSlug: 'confirmation',
    allSteps: orderFlowSteps,
    stepGroups,
  },
};

export function getE2EMockData() {
  return {
    pricing: clone(pricing),
    siteSettings: clone(siteSettings),
    garments: clone(garments),
    repairTypes: clone(repairTypes),
    storeLocations: clone(storeLocations),
    postenOptions: clone(postenOptions),
    deliveryOptions: clone(deliveryOptions),
    orderFlow: clone(orderFlow),
  };
}
