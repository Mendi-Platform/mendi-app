import type { Metadata } from "next";
import { getGarments } from "@/sanity/lib/queries";
import GarmentPageClient from "./GarmentPageClient";

export const metadata: Metadata = {
  title: "Velg plagg",
  description: "Velg type plagg du ønsker reparert eller tilpasset",
};

export default async function GarmentPage() {
  const garments = await getGarments();

  return <GarmentPageClient garments={garments} />;
}
