import pricing from './pricing';
import repairPrice from './repairPrice';
import deliveryOption from './deliveryOption';
import storeLocation from './storeLocation';
import postenOption from './postenOption';
import garment from './garment';
import repairType from './repairType';
import siteSettings from './siteSettings';
import orderFlowStep from './orderFlowStep';
import orderStepGroup from './orderStepGroup';
import routingRule from './objects/routingRule';
import routingCondition from './objects/routingCondition';

export const schemaTypes = [
  // Configuration
  pricing,
  siteSettings,

  // Order Flow
  orderFlowStep,
  orderStepGroup,
  routingRule,
  routingCondition,

  // Content types
  repairPrice,
  deliveryOption,
  storeLocation,
  postenOption,
  garment,
  repairType,
];
