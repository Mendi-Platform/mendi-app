import postenLogo from '@/app/assets/icons/posten-logo.svg';
import { SHIPPING_PRICES } from './prices';

export enum DeliveryType {
  None = '',
  Syer = 'syer',
  PickupPoint = 'pickup_point',
  Posten = 'posten',
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  price: number;
  logo: typeof postenLogo;
}

export interface PostenOption {
  id: string;
  name: string;
  address: string;
  price: number;
  logo: typeof postenLogo;
}

export const STORE_LOCATIONS: StoreLocation[] = [
  {
    id: 'grunerløkka',
    name: 'Grünerløkka, Oslo',
    address: 'Raw Denim & Vintage Jeans',
    price: SHIPPING_PRICES.FREE,
    logo: postenLogo,
  },
  {
    id: 'grunerløkka-xaki',
    name: 'Grünerløkka, Oslo',
    address: 'XAKI',
    price: SHIPPING_PRICES.FREE,
    logo: postenLogo,
  },
  {
    id: 'uio',
    name: 'UiO, Oslo',
    address: 'Forskningsparken',
    price: SHIPPING_PRICES.FREE,
    logo: postenLogo,
  },
  {
    id: 'sentrum',
    name: 'Sentrum, Bergen',
    address: 'The Second Hand',
    price: SHIPPING_PRICES.FREE,
    logo: postenLogo,
  },
];

export const POSTEN_OPTIONS: PostenOption[] = [
  {
    id: 'lite-0-5kg',
    name: 'Lite 0-5 kg',
    address: 'Oppti 35 x 23 x 5 cm, tur + retur',
    price: SHIPPING_PRICES.POSTEN_SMALL,
    logo: postenLogo,
  },
  {
    id: 'stor-0-10kg',
    name: 'Stor 0-10 kg',
    address: 'Oppti 35 x 23 x 15 cm, tur + retur',
    price: SHIPPING_PRICES.POSTEN_LARGE,
    logo: postenLogo,
  },
];

export const getShippingCost = (
  deliveryType: DeliveryType,
  selectedPostenId?: string
): number => {
  switch (deliveryType) {
    case DeliveryType.PickupPoint:
      return SHIPPING_PRICES.FREE;
    case DeliveryType.Syer:
      return SHIPPING_PRICES.MEET_TAILOR;
    case DeliveryType.Posten:
      if (selectedPostenId) {
        const selected = POSTEN_OPTIONS.find(opt => opt.id === selectedPostenId);
        return selected ? selected.price : SHIPPING_PRICES.POSTEN_SMALL;
      }
      return SHIPPING_PRICES.POSTEN_SMALL;
    default:
      return SHIPPING_PRICES.FREE;
  }
};
