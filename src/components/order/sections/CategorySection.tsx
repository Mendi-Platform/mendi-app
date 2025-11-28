"use client";

import CategoryCard from "@/components/ui/categoryCard";
import { useCart } from "@/contexts/CartContext";
import type { CategorySlug } from "@/types/formData";
import type { SanityPricing, SanitySiteSettings, OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";

interface CategorySectionProps {
  pricing: SanityPricing | null;
  siteSettings: SanitySiteSettings | null;
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

export default function CategorySection({
  pricing,
  siteSettings,
  orderFlowConfig,
}: CategorySectionProps) {
  const { language } = useLanguage();
  const { formData, updateFormField, addToCart } = useCart();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  // Get colors from site settings or use defaults
  const colors = {
    primary: siteSettings?.primaryColor || '#006EFF',
    textSecondary: siteSettings?.textSecondaryColor || '#797979',
    textDisabled: siteSettings?.textDisabledColor || '#A7A7A7',
  };

  // Base prices from Sanity or defaults
  const BASE_PRICES: Record<string, number> = {
    'standard': pricing?.standardPrice || 399,
    'premium': pricing?.premiumPrice || 499,
  };

  const onChoice = (slug: CategorySlug) => {
    updateFormField('categorySlug', slug);
    updateFormField('price', slug !== '' ? BASE_PRICES[slug] : undefined);
  };

  const handleAddToCart = () => {
    addToCart();
    navigateToNext('category');
  };

  const isOuterWear = formData.garmentSlug === 'outer-wear';
  const isEnabled = formData.categorySlug !== '';

  // i18n labels
  const labels = {
    title: language === 'nb' ? 'Velg etter dine behov:' : 'Choose according to your needs:',
    subtitle: language === 'nb' ? 'Velg alternativet som passer deg best.' : 'Choose the option that suits you best.',
    outerWearNote: language === 'nb'
      ? 'Vi krever premiumservice for jakker og yttertøy, fordi disse materialene trenger nøye håndtering og spesifikke sømmeteknikker.'
      : 'We require premium service for jackets and outerwear, because these materials need careful handling and specific sewing techniques.',
    addToCart: language === 'nb' ? 'Legg i handlekurven' : 'Add to cart',
    standard: 'Standard',
    premium: 'Premium',
  };

  return (
    <div className="w-full max-w-md lg:max-w-2xl mx-auto">
      <h1 className="font-medium text-lg mb-3">{labels.title}</h1>
      <p
        className="mb-11 text-sm italic"
        style={{ color: colors.textSecondary }}
      >
        {labels.subtitle}
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        {isOuterWear ? (
          <div className="pointer-events-none cursor-default">
            <CategoryCard
              formData={formData}
              isActive={formData.categorySlug === 'premium'}
              title={labels.premium}
              price={BASE_PRICES['premium']}
              isPopular
              onClick={() => {}}
            />
          </div>
        ) : (
          <>
            <CategoryCard
              formData={formData}
              onClick={() => onChoice('standard')}
              isActive={formData.categorySlug === 'standard'}
              title={labels.standard}
              price={BASE_PRICES['standard']}
            />
            <CategoryCard
              formData={formData}
              onClick={() => onChoice('premium')}
              isActive={formData.categorySlug === 'premium'}
              isPopular
              title={labels.premium}
              price={BASE_PRICES['premium']}
            />
          </>
        )}
      </div>
      {isOuterWear && (
        <div className="text-sm italic mb-6" style={{ color: colors.textSecondary }}>
          {labels.outerWearNote}
        </div>
      )}
      <button
        className="block w-full text-center py-2.5 rounded-[20px] text-xl font-semibold transition-opacity"
        onClick={handleAddToCart}
        disabled={!isEnabled}
        style={{
          backgroundColor: isEnabled ? colors.primary : 'white',
          color: isEnabled ? 'white' : colors.textDisabled,
          border: isEnabled ? 'none' : '1px solid rgba(0,0,0,0.3)',
        }}
        onMouseOver={(e) => isEnabled && (e.currentTarget.style.opacity = '0.7')}
        onMouseOut={(e) => isEnabled && (e.currentTarget.style.opacity = '1')}
      >
        {labels.addToCart}
      </button>
    </div>
  );
}
