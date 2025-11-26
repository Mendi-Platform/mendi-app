import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Logg inn",
  description: "Logg inn eller opprett en Mendi-konto",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifySession();
  return (
    <div className="min-h-screen bg-white">
      <div className="px-5 pt-2">
        <Image
          className="dark:invert"
          src="/mendi-app.svg"
          alt="Next.js logo"
          width={73}
          height={21}
          priority
        />
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col max-w-[370px] mx-auto">{children}</div>
      </div>
    </div>
  );
}
