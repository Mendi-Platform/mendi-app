import Image from "next/image";
import Link from "next/link";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { getSiteSettings } from "@/sanity/lib/queries";
import OrderSteps from "@/components/order/OrderSteps";

export default async function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();

  // CSS custom properties for colors from Sanity
  const colorStyles = siteSettings ? {
    '--color-primary': siteSettings.primaryColor,
    '--color-primary-hover': siteSettings.primaryHoverColor,
    '--color-primary-light': siteSettings.primaryLightColor,
    '--color-text-primary': siteSettings.textPrimaryColor,
    '--color-text-secondary': siteSettings.textSecondaryColor,
    '--color-text-disabled': siteSettings.textDisabledColor,
    '--color-bg-default': siteSettings.bgDefaultColor,
    '--color-border': siteSettings.borderColor,
  } as React.CSSProperties : {};

  return (
    <LanguageProvider defaultLanguage="nb">
      <CartProvider>
        <div className="min-h-screen bg-white" style={colorStyles}>
        <div className="px-5 border-b border-gray-200">
          <div className="flex items-center justify-between h-16">
            <Link href="/order/garment">
              {siteSettings?.logo && (
                <Image
                  src={siteSettings.logo}
                  alt="Mendi"
                  width={100}
                  height={40}
                  priority
                />
              )}
            </Link>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                {siteSettings?.questionIcon && (
                  <Image
                    src={siteSettings.questionIcon}
                    alt="Help"
                    width={24}
                    height={24}
                    style={{ width: 24, height: 'auto' }}
                  />
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                {siteSettings?.cartIcon && (
                  <Image
                    src={siteSettings.cartIcon}
                    alt="Cart"
                    width={24}
                    height={24}
                    style={{ width: 24, height: 'auto' }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-8">
          <OrderSteps />
          <div className="flex flex-col max-w-md lg:max-w-4xl mx-auto">{children}</div>
        </div>
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
