import { getPricing, getSiteSettings } from "@/sanity/lib/queries";
import CategoryClient from "./CategoryClient";

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
