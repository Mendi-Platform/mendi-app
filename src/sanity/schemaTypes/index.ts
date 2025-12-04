import { type SchemaTypeDefinition } from 'sanity'

// Import schemas
import pricing from '../schemas/pricing'
import repairPrice from '../schemas/repairPrice'
import deliveryOption from '../schemas/deliveryOption'
import storeLocation from '../schemas/storeLocation'
import postenOption from '../schemas/postenOption'
import garment from '../schemas/garment'
import repairType from '../schemas/repairType'
import siteSettings from '../schemas/siteSettings'
import orderFlowStep from '../schemas/orderFlowStep'
import orderStepGroup from '../schemas/orderStepGroup'

// Import localized object types
import localizedString from '../schemas/objects/localizedString'
import localizedText from '../schemas/objects/localizedText'

// Import routing object types
import routingRule from '../schemas/objects/routingRule'
import routingCondition from '../schemas/objects/routingCondition'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Object types (must be first as they're referenced by documents)
    localizedString,
    localizedText,
    routingCondition,
    routingRule,
    // Configuration
    pricing,
    siteSettings,
    // Order Flow
    orderStepGroup,
    orderFlowStep,
    // Content types
    repairPrice,
    deliveryOption,
    storeLocation,
    postenOption,
    garment,
    repairType,
  ],
}
