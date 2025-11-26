import { getGarments } from "@/sanity/lib/queries";
import GarmentPageClient from "./GarmentPageClient";

export default async function GarmentPage() {
  const garments = await getGarments();

  return <GarmentPageClient garments={garments} />;
}
