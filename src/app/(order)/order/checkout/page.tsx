import type { Metadata } from "next";
import {
  getStoreLocations,
  getPostenOptions,
  getDeliveryOptions,
  getPricing,
  getSiteSettings,
} from "@/sanity/lib/queries";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Kasse",
  description: "Fullfør din bestilling",
};

export default async function CheckoutPage() {
  const [storeLocations, postenOptions, deliveryOptions, pricing, siteSettings] =
    await Promise.all([
      getStoreLocations(),
      getPostenOptions(),
      getDeliveryOptions(),
      getPricing(),
      getSiteSettings(),
    ]);

  return (
    <CheckoutClient
      storeLocations={storeLocations}
      postenOptions={postenOptions}
      deliveryOptions={deliveryOptions}
      pricing={pricing}
      siteSettings={siteSettings}
    />
  );
}
