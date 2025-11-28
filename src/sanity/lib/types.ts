// Sanity CMS Types

// Language type for i18n
export type Language = 'nb' | 'en'

// Localized string type
export interface LocalizedString {
  nb?: string
  en?: string
}

// Localized text type (for longer content)
export interface LocalizedText {
  nb?: string
  en?: string
}

// Localized array type (for arrays of strings)
export interface LocalizedArray {
  nb?: string[]
  en?: string[]
}

// Helper function to get localized value
export function getLocalizedValue(
  localized: LocalizedString | LocalizedText | undefined,
  language: Language = 'nb'
): string {
  if (!localized) return ''
  return localized[language] || localized['nb'] || ''
}

// Helper function to get localized array
export function getLocalizedArray(
  localized: LocalizedArray | undefined,
  language: Language = 'nb'
): string[] {
  if (!localized) return []
  return localized[language] || localized['nb'] || []
}

export interface SanityPricing {
  standardPrice: number
  premiumPrice: number
  premiumAddon: number
  staticItemPrice: number
}

export interface SanityStoreLocation {
  _id: string
  name: string
  address: string
  city: string
  price: number
  logo?: string
  order: number
}

export interface SanityPostenOption {
  _id: string
  name: LocalizedString
  description: LocalizedString
  price: number
  logo?: string
  order: number
}

export interface SanityDeliveryOption {
  _id: string
  name: LocalizedString
  type: 'pickup_point' | 'syer' | 'posten'
  price: number
  description: LocalizedText
  address?: string
  logo?: string
  order: number
}

export interface SanityGarment {
  _id: string
  name: string
  slug: { current: string }
  label: LocalizedString
  icon?: string
  damageMarkerFront?: string
  damageMarkerBack?: string
  order: number
  isPremiumOnly: boolean
}

export interface SanityRepairType {
  _id: string
  name: string
  slug: { current: string }
  label: LocalizedString
  description?: LocalizedText
  order: number
}

export interface SanityRepairPrice {
  _id: string
  name: LocalizedString
  slug: { current: string }
  price: number
  description?: LocalizedText
}

export interface RoutingCondition {
  formField: string
  operator: 'equals' | 'in' | 'notEquals' | 'notIn' | 'isEmpty' | 'isNotEmpty'
  values?: string[]
}

export interface RoutingRule {
  conditions: RoutingCondition[]
  nextStep: {
    _ref: string
    slug?: { current: string }
  }
  priority: number
  description?: string
}

export interface SanityOrderStepGroup {
  _id: string
  name: string
  label: LocalizedString
  order: number
  color?: string
}

export interface SanityOrderFlowStep {
  _id: string
  slug: { current: string }
  label: LocalizedString
  stepGroupId: {
    _ref: string
    _type: 'reference'
  }
  defaultOrder: number
  componentType: string
  nextStepRules?: RoutingRule[]
  defaultNextStep?: {
    _ref: string
    slug?: { current: string }
  }
  isOptional: boolean
  skipConditions?: RoutingCondition[]
}

export interface SanityOrderFlowConfig {
  startStep: {
    _ref: string
    slug?: { current: string }
  }
  confirmationStep: {
    _ref: string
    slug?: { current: string }
  }
  allSteps: Array<{
    _ref: string
    _type: 'reference'
  }>
  stepGroups: Array<{
    _ref: string
    _type: 'reference'
  }>
}

export interface OrderFlowStepExpanded extends SanityOrderFlowStep {
  stepGroup: SanityOrderStepGroup
  nextStepRules?: Array<RoutingRule & {
    nextStepSlug?: string
  }>
  defaultNextStepSlug?: string
}

export interface SanitySiteSettings {
  logo?: string
  questionIcon?: string
  cartIcon?: string
  primaryColor: string
  primaryHoverColor: string
  primaryLightColor: string
  textPrimaryColor: string
  textSecondaryColor: string
  textDisabledColor: string
  bgDefaultColor: string
  borderColor: string
  checkoutSteps: LocalizedArray
  deliverySteps: LocalizedArray
  maxSavedAddresses: number
  orderFlowConfig?: SanityOrderFlowConfig
}
