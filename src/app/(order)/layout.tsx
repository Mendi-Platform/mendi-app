import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { getSiteSettings } from "@/sanity/lib/queries";
import OrderSteps from "@/components/order/OrderSteps";
import OrderNavbar from "@/components/order/OrderNavbar";

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
          <OrderNavbar siteSettings={siteSettings} />
          <div className="container mx-auto px-6 py-8">
            <OrderSteps />
            <div className="flex flex-col max-w-md lg:max-w-4xl mx-auto">{children}</div>
          </div>
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
