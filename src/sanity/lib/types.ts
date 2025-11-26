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

export interface SanitySiteSettings {
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
}
