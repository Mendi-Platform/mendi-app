export const CATEGORY_PRICES = {
  STANDARD: 399,
  PREMIUM: 499,
  PREMIUM_ADDON: 100,
} as const;

export const REPAIR_PRICES = {
  ZIPPER_SHORT: 399,
  ZIPPER_LONG: 599,
  HOLE_SMALL: 199,
  HOLE_BIG: 299,
  HEMMING_SINGLE: 399,
  HEMMING_MULTIPLE: 499,
  WAIST_SINGLE: 299,
  WAIST_MULTIPLE: 399,
  BUTTON_PER_UNIT: 99,
  BELT_LOOPS_UP_TO_2: 199,
  BELT_LOOPS_UP_TO_5: 399,
  STATIC_ITEM: 199,
} as const;

export const SHIPPING_PRICES = {
  FREE: 0,
  MEET_TAILOR: 99,
  POSTEN_SMALL: 158,
  POSTEN_LARGE: 198,
} as const;

export type CategoryPriceKey = keyof typeof CATEGORY_PRICES;
export type RepairPriceKey = keyof typeof REPAIR_PRICES;
export type ShippingPriceKey = keyof typeof SHIPPING_PRICES;
