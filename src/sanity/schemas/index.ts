import pricing from './pricing';
import repairPrice from './repairPrice';
import deliveryOption from './deliveryOption';
import storeLocation from './storeLocation';
import postenOption from './postenOption';
import garment from './garment';
import repairType from './repairType';
import siteSettings from './siteSettings';

export const schemaTypes = [
  // Configuration
  pricing,
  siteSettings,

  // Content types
  repairPrice,
  deliveryOption,
  storeLocation,
  postenOption,
  garment,
  repairType,
];
