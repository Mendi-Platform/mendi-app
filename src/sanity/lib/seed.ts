/**
 * Sanity seed data - Run this script to populate initial data
 * Usage: POST to /api/sanity/seed
 * Requires SANITY_API_TOKEN environment variable
 */

// Pricing Configuration
export const pricingData = {
  _type: 'pricing',
  _id: 'pricing-config',
  standardPrice: 399,
  premiumPrice: 499,
  premiumAddon: 100,
  staticItemPrice: 199,
};

// Site Settings with i18n
export const siteSettingsData = {
  _type: 'siteSettings',
  _id: 'site-settings',
  title: 'Mendi',
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

// Store Locations (locations don't need translation - they're proper nouns)
export const storeLocationsData = [
  {
    _type: 'storeLocation',
    _id: 'store-grunerløkka',
    name: 'Grünerløkka, Oslo',
    address: 'Raw Denim & Vintage Jeans',
    city: 'Oslo',
    price: 0,
    order: 1,
  },
  {
    _type: 'storeLocation',
    _id: 'store-grunerløkka-xaki',
    name: 'Grünerløkka, Oslo',
    address: 'XAKI',
    city: 'Oslo',
    price: 0,
    order: 2,
  },
  {
    _type: 'storeLocation',
    _id: 'store-uio',
    name: 'UiO, Oslo',
    address: 'Forskningsparken',
    city: 'Oslo',
    price: 0,
    order: 3,
  },
  {
    _type: 'storeLocation',
    _id: 'store-sentrum-bergen',
    name: 'Sentrum, Bergen',
    address: 'The Second Hand',
    city: 'Bergen',
    price: 0,
    order: 4,
  },
];

// Posten Options with i18n
export const postenOptionsData = [
  {
    _type: 'postenOption',
    _id: 'posten-small',
    name: { nb: 'Lite 0-5 kg', en: 'Small 0-5 kg' },
    description: { nb: 'Opptil 35 x 23 x 5 cm, tur + retur', en: 'Up to 35 x 23 x 5 cm, round trip' },
    price: 158,
    order: 1,
  },
  {
    _type: 'postenOption',
    _id: 'posten-large',
    name: { nb: 'Stor 0-10 kg', en: 'Large 0-10 kg' },
    description: { nb: 'Opptil 35 x 23 x 15 cm, tur + retur', en: 'Up to 35 x 23 x 15 cm, round trip' },
    price: 198,
    order: 2,
  },
];

// Delivery Options with i18n
export const deliveryOptionsData = [
  {
    _type: 'deliveryOption',
    _id: 'delivery-pickup',
    name: { nb: 'Drop-off i butikk', en: 'Drop-off at store' },
    type: 'pickup_point',
    price: 0,
    description: { nb: 'Lever plagget til en av våre samarbeidspartnere', en: 'Deliver the garment to one of our partners' },
    order: 1,
  },
  {
    _type: 'deliveryOption',
    _id: 'delivery-syer',
    name: { nb: 'Møt syer', en: 'Meet tailor' },
    type: 'syer',
    price: 99,
    description: {
      nb: 'Møt din lokale skredder på et sentralt sted. Du blir kontaktet, og all kommunikasjon skjer via meldinger.',
      en: 'Meet your local tailor at a central location. You will be contacted, and all communication happens via messages.'
    },
    order: 2,
  },
  {
    _type: 'deliveryOption',
    _id: 'delivery-posten',
    name: { nb: 'Posten', en: 'Posten (Mail)' },
    type: 'posten',
    price: 158,
    description: { nb: 'Send plagget med Posten', en: 'Send the garment via Posten' },
    order: 3,
  },
];

// Garment Types with i18n
export const garmentsData = [
  { _type: 'garment', _id: 'garment-upper', name: 'upper_body', slug: { current: 'upper-body' }, label: { nb: 'Overdel', en: 'Upper body' }, order: 1, isPremiumOnly: false },
  { _type: 'garment', _id: 'garment-lower', name: 'lower_body', slug: { current: 'lower-body' }, label: { nb: 'Underdel', en: 'Lower body' }, order: 2, isPremiumOnly: false },
  { _type: 'garment', _id: 'garment-kjole', name: 'kjole', slug: { current: 'kjole' }, label: { nb: 'Kjole', en: 'Dress' }, order: 3, isPremiumOnly: false },
  { _type: 'garment', _id: 'garment-dress', name: 'dress', slug: { current: 'dress' }, label: { nb: 'Dress', en: 'Suit' }, order: 4, isPremiumOnly: false },
  { _type: 'garment', _id: 'garment-outerwear', name: 'outerwear', slug: { current: 'outerwear' }, label: { nb: 'Yttertøy', en: 'Outerwear' }, order: 5, isPremiumOnly: true },
  { _type: 'garment', _id: 'garment-leather', name: 'leather', slug: { current: 'leather' }, label: { nb: 'Skinnartikler', en: 'Leather goods' }, order: 6, isPremiumOnly: true },
  { _type: 'garment', _id: 'garment-curtains', name: 'curtains', slug: { current: 'curtains' }, label: { nb: 'Gardiner', en: 'Curtains' }, order: 7, isPremiumOnly: false },
];

// Repair Types with i18n
export const repairTypesData = [
  { _type: 'repairType', _id: 'repair-zipper', name: 'replace_zipper', slug: { current: 'replace-zipper' }, label: { nb: 'Bytte glidelås', en: 'Replace zipper' }, order: 1 },
  { _type: 'repairType', _id: 'repair-button', name: 'sew_button', slug: { current: 'sew-button' }, label: { nb: 'Sy på knapp', en: 'Sew button' }, order: 2 },
  { _type: 'repairType', _id: 'repair-hole-small', name: 'small_hole', slug: { current: 'small-hole' }, label: { nb: 'Lite hull', en: 'Small hole' }, order: 3 },
  { _type: 'repairType', _id: 'repair-hole-big', name: 'big_hole', slug: { current: 'big-hole' }, label: { nb: 'Stort hull', en: 'Large hole' }, order: 4 },
  { _type: 'repairType', _id: 'repair-belt-loops', name: 'belt_loops', slug: { current: 'belt-loops' }, label: { nb: 'Beltestropper', en: 'Belt loops' }, order: 5 },
  { _type: 'repairType', _id: 'repair-hemming', name: 'hemming', slug: { current: 'hemming' }, label: { nb: 'Legge opp', en: 'Hemming' }, order: 6 },
  { _type: 'repairType', _id: 'repair-waist', name: 'adjust_waist', slug: { current: 'adjust-waist' }, label: { nb: 'Justere midje', en: 'Adjust waist' }, order: 7 },
  { _type: 'repairType', _id: 'repair-other', name: 'other_request', slug: { current: 'other-request' }, label: { nb: 'Annet', en: 'Other' }, order: 8 },
];

// Repair Prices with i18n
export const repairPricesData = [
  { _type: 'repairPrice', _id: 'price-zipper-short', name: { nb: 'Glidelås kort', en: 'Zipper short' }, slug: { current: 'zipper-short' }, price: 399 },
  { _type: 'repairPrice', _id: 'price-zipper-long', name: { nb: 'Glidelås lang', en: 'Zipper long' }, slug: { current: 'zipper-long' }, price: 599 },
  { _type: 'repairPrice', _id: 'price-hole-small', name: { nb: 'Lite hull', en: 'Small hole' }, slug: { current: 'hole-small' }, price: 199 },
  { _type: 'repairPrice', _id: 'price-hole-big', name: { nb: 'Stort hull', en: 'Large hole' }, slug: { current: 'hole-big' }, price: 299 },
  { _type: 'repairPrice', _id: 'price-hemming-single', name: { nb: 'Legge opp (enkelt)', en: 'Hemming (single)' }, slug: { current: 'hemming-single' }, price: 399 },
  { _type: 'repairPrice', _id: 'price-hemming-multi', name: { nb: 'Legge opp (flere)', en: 'Hemming (multiple)' }, slug: { current: 'hemming-multi' }, price: 499 },
  { _type: 'repairPrice', _id: 'price-waist-single', name: { nb: 'Justere midje (enkelt)', en: 'Adjust waist (single)' }, slug: { current: 'waist-single' }, price: 299 },
  { _type: 'repairPrice', _id: 'price-waist-multi', name: { nb: 'Justere midje (flere)', en: 'Adjust waist (multiple)' }, slug: { current: 'waist-multi' }, price: 399 },
  { _type: 'repairPrice', _id: 'price-button', name: { nb: 'Knapp per stk', en: 'Button each' }, slug: { current: 'button' }, price: 99 },
  { _type: 'repairPrice', _id: 'price-belt-loops-2', name: { nb: 'Beltestropper (opptil 2)', en: 'Belt loops (up to 2)' }, slug: { current: 'belt-loops-2' }, price: 199 },
  { _type: 'repairPrice', _id: 'price-belt-loops-5', name: { nb: 'Beltestropper (opptil 5)', en: 'Belt loops (up to 5)' }, slug: { current: 'belt-loops-5' }, price: 399 },
];

// All data for import
export const allSeedData = [
  pricingData,
  siteSettingsData,
  ...storeLocationsData,
  ...postenOptionsData,
  ...deliveryOptionsData,
  ...garmentsData,
  ...repairTypesData,
  ...repairPricesData,
];
