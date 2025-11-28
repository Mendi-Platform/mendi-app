import type { Metadata } from "next";
import { getPricing, getSiteSettings, getGarments } from "@/sanity/lib/queries";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Handlekurv",
  description: "Se gjennom bestillingen din før du fortsetter",
};

export default async function CartPage() {
  const [pricing, siteSettings, garments] = await Promise.all([
    getPricing(),
    getSiteSettings(),
    getGarments(),
  ]);

  return (
    <CartClient
      pricing={pricing}
      siteSettings={siteSettings}
      garments={garments}
    />
  );
} 