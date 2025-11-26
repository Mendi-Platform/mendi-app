import { getRepairTypes } from "@/sanity/lib/queries";
import ServicePageClient from "./ServicePageClient";

export default async function ServicePage() {
  const repairTypes = await getRepairTypes();

  return <ServicePageClient repairTypes={repairTypes} />;
}
