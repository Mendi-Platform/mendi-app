import type { Metadata } from "next";
import { getPricing, getSiteSettings } from "@/sanity/lib/queries";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Handlekurv",
  description: "Se gjennom bestillingen din før du fortsetter",
};

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