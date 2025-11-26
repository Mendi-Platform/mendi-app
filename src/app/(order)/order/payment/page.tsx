import type { Metadata } from "next";
import {
  getStoreLocations,
  getPostenOptions,
  getDeliveryOptions,
  getPricing,
  getSiteSettings,
} from "@/sanity/lib/queries";
import PaymentPageClient from "./PaymentPageClient";

export const metadata: Metadata = {
  title: "Betaling",
  description: "Fullfør bestillingen din med trygg betaling",
};

export default async function PaymentPage() {
  // Fetch all data from Sanity in parallel
  const [storeLocations, postenOptions, deliveryOptions, pricing, siteSettings] = await Promise.all([
    getStoreLocations(),
    getPostenOptions(),
    getDeliveryOptions(),
    getPricing(),
    getSiteSettings(),
  ]);

  return (
    <PaymentPageClient
      storeLocations={storeLocations}
      postenOptions={postenOptions}
      deliveryOptions={deliveryOptions}
      pricing={pricing}
      siteSettings={siteSettings}
    />
  );
}
