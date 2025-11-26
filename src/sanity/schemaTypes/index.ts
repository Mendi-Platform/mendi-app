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

// Import localized object types
import localizedString from '../schemas/objects/localizedString'
import localizedText from '../schemas/objects/localizedText'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Localized object types (must be first)
    localizedString,
    localizedText,
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
  ],
}
