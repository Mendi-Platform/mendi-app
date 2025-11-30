import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { getSiteSettings, getOrderFlow } from "@/sanity/lib/queries";
import OrderSteps from "@/components/order/OrderSteps";
import OrderNavbar from "@/components/order/OrderNavbar";

export default async function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteSettings = await getSiteSettings();

  // Fetch order flow configuration
  const orderFlowData = await getOrderFlow();
  const orderFlowConfig = orderFlowData?.orderFlowConfig || null;

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
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
            <OrderSteps orderFlowConfig={orderFlowConfig} />
            <div className="flex flex-col w-full">{children}</div>
          </div>
        </div>
      </CartProvider>
    </LanguageProvider>
  );
}
