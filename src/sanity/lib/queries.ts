import { groq } from 'next-sanity';
import { client } from './client';
import type {
  SanityPricing,
  SanityStoreLocation,
  SanityPostenOption,
  SanityDeliveryOption,
  SanityGarment,
  SanityRepairType,
  SanityRepairPrice,
  SanitySiteSettings,
} from './types';

// GROQ Queries
export const getPricingQuery = groq`*[_type == "pricing"][0]{
  standardPrice,
  premiumPrice,
  premiumAddon,
  staticItemPrice
}`;

export const getRepairPricesQuery = groq`*[_type == "repairPrice"]{
  _id,
  name { nb, en },
  slug,
  price,
  description { nb, en }
} | order(name.nb asc)`;

export const getDeliveryOptionsQuery = groq`*[_type == "deliveryOption"]{
  _id,
  name { nb, en },
  type,
  price,
  description { nb, en },
  address,
  "logo": logo.asset->url,
  order
} | order(order asc)`;

export const getStoreLocationsQuery = groq`*[_type == "storeLocation"]{
  _id,
  name,
  address,
  city,
  price,
  "logo": logo.asset->url,
  order
} | order(order asc)`;

export const getPostenOptionsQuery = groq`*[_type == "postenOption"]{
  _id,
  name { nb, en },
  description { nb, en },
  price,
  "logo": logo.asset->url,
  order
} | order(order asc)`;

export const getGarmentsQuery = groq`*[_type == "garment"]{
  _id,
  name,
  slug,
  label { nb, en },
  "icon": icon.asset->url,
  "damageMarkerFront": damageMarkerFront.asset->url,
  "damageMarkerBack": damageMarkerBack.asset->url,
  order,
  isPremiumOnly
} | order(order asc)`;

export const getRepairTypesQuery = groq`*[_type == "repairType"]{
  _id,
  name,
  slug,
  label { nb, en },
  description { nb, en },
  order
} | order(order asc)`;

export const getSiteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  "logo": logo.asset->url,
  "questionIcon": questionIcon.asset->url,
  "cartIcon": cartIcon.asset->url,
  primaryColor,
  primaryHoverColor,
  primaryLightColor,
  textPrimaryColor,
  textSecondaryColor,
  textDisabledColor,
  bgDefaultColor,
  borderColor,
  checkoutSteps { nb, en },
  deliverySteps { nb, en },
  maxSavedAddresses
}`;

// Fetch Functions with caching
export async function getPricing(): Promise<SanityPricing | null> {
  return client.fetch(getPricingQuery, {}, { next: { revalidate: 60 } });
}

export async function getStoreLocations(): Promise<SanityStoreLocation[]> {
  return client.fetch(getStoreLocationsQuery, {}, { next: { revalidate: 60 } });
}

export async function getPostenOptions(): Promise<SanityPostenOption[]> {
  return client.fetch(getPostenOptionsQuery, {}, { next: { revalidate: 60 } });
}

export async function getDeliveryOptions(): Promise<SanityDeliveryOption[]> {
  return client.fetch(getDeliveryOptionsQuery, {}, { next: { revalidate: 60 } });
}

export async function getGarments(): Promise<SanityGarment[]> {
  return client.fetch(getGarmentsQuery, {}, { next: { revalidate: 60 } });
}

export async function getRepairTypes(): Promise<SanityRepairType[]> {
  return client.fetch(getRepairTypesQuery, {}, { next: { revalidate: 60 } });
}

export async function getRepairPrices(): Promise<SanityRepairPrice[]> {
  return client.fetch(getRepairPricesQuery, {}, { next: { revalidate: 60 } });
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return client.fetch(getSiteSettingsQuery, {}, { next: { revalidate: 60 } });
}
