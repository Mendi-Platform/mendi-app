import {
  getStoreLocations,
  getPostenOptions,
  getDeliveryOptions,
  getPricing,
  getSiteSettings,
} from "@/sanity/lib/queries";
import DeliveryChoiceClient from "./DeliveryChoiceClient";

export default async function DeliveryChoicePage() {
  // Fetch all data from Sanity in parallel
  const [storeLocations, postenOptions, deliveryOptions, pricing, siteSettings] = await Promise.all([
    getStoreLocations(),
    getPostenOptions(),
    getDeliveryOptions(),
    getPricing(),
    getSiteSettings(),
  ]);

  return (
    <DeliveryChoiceClient
      storeLocations={storeLocations}
      postenOptions={postenOptions}
      deliveryOptions={deliveryOptions}
      pricing={pricing}
      siteSettings={siteSettings}
    />
  );
} 