import { SHIPPING_PRICES } from './prices';

export enum DeliveryType {
  None = '',
  Syer = 'syer',
  PickupPoint = 'pickup_point',
  Posten = 'posten',
}

// Note: Store locations and Posten options are now managed in Sanity CMS
// Use getStoreLocations() and getPostenOptions() from @/sanity/lib/queries instead

export const getShippingCost = (
  deliveryType: DeliveryType,
  selectedPostenPrice?: number
): number => {
  switch (deliveryType) {
    case DeliveryType.PickupPoint:
      return SHIPPING_PRICES.FREE;
    case DeliveryType.Syer:
      return SHIPPING_PRICES.MEET_TAILOR;
    case DeliveryType.Posten:
      return selectedPostenPrice ?? SHIPPING_PRICES.POSTEN_SMALL;
    default:
      return SHIPPING_PRICES.FREE;
  }
};
