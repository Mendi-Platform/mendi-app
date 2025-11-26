import type { Metadata } from "next";
import { getRepairTypes } from "@/sanity/lib/queries";
import ServicePageClient from "./ServicePageClient";

export const metadata: Metadata = {
  title: "Velg tjeneste",
  description: "Velg hvilken type reparasjon eller tilpasning du trenger",
};

export default async function ServicePage() {
  const repairTypes = await getRepairTypes();

  return <ServicePageClient repairTypes={repairTypes} />;
}
