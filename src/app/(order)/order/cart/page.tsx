import { getPricing, getSiteSettings } from "@/sanity/lib/queries";
import CartClient from "./CartClient";

export default async function CartPage() {
  const [pricing, siteSettings] = await Promise.all([
    getPricing(),
    getSiteSettings(),
  ]);

  return (
    <CartClient
      pricing={pricing}
      siteSettings={siteSettings}
    />
  );
} 