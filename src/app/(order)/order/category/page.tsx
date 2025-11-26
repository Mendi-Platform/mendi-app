import type { Metadata } from "next";
import { getPricing, getSiteSettings } from "@/sanity/lib/queries";
import CategoryClient from "./CategoryClient";

export const metadata: Metadata = {
  title: "Velg kategori",
  description: "Velg kategori for reparasjonen din",
};

export default async function CategoryPage() {
  const [pricing, siteSettings] = await Promise.all([
    getPricing(),
    getSiteSettings(),
  ]);

  return (
    <CategoryClient
      pricing={pricing}
      siteSettings={siteSettings}
    />
  );
}
