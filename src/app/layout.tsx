import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Mendi",
    template: "%s | Mendi",
  },
  description: "Mendi – Enkel reparasjon og tilpasning av klær i hele Norge",
  keywords: ["reparasjon", "klær", "søm", "tilpasning", "Norge", "skredder"],
  authors: [{ name: "Mendi" }],
  creator: "Mendi",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Mendi",
    title: "Mendi",
    description: "Enkel reparasjon og tilpasning av klær i hele Norge",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body className={`${inter.variable} antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
