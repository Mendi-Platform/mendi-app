import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Hjem",
  description: "Mendi – Enkel reparasjon og tilpasning av klær i hele Norge",
};

export default function Home() {
  redirect('/order/service')
  return (<></>
  );
}
