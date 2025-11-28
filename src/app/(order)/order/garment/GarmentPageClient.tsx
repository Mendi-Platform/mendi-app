"use client";

import GridButtonOption from "@/components/ui/gridButtonOption";
import { useCart } from "@/contexts/CartContext";
import type { SanityGarment, OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";
import { getLocalizedValue } from "@/sanity/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { GarmentSlug } from "@/types/formData";

interface GarmentPageClientProps {
  garments: SanityGarment[];
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  } | null;
}

const GarmentPageClient = ({ garments, orderFlowConfig }: GarmentPageClientProps) => {
  const { language } = useLanguage();
  const { formData, updateFormField } = useCart();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  const onChoice = (slug: GarmentSlug) => {
    updateFormField("garmentSlug", slug);
    // Auto-set premium category for outer-wear
    if (slug === 'outer-wear') {
      updateFormField("categorySlug", 'premium');
    } else {
      updateFormField("categorySlug", '');
    }
  };

  const handleContinue = () => {
    navigateToNext('garment');
  };

  // i18n labels
  const labels = {
    title: language === 'nb'
      ? 'Hvilken type plagg vil du registrere?'
      : 'What type of garment would you like to register?',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
  };

  const isEnabled = formData.garmentSlug !== '';

  return (
    <>
      <h1 className="font-medium text-lg mb-11">
        {labels.title}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14">
        {garments.map((garment) => (
          <GridButtonOption
            key={garment._id}
            label={getLocalizedValue(garment.label, language)}
            logo={garment.icon}
            active={formData.garmentSlug === garment.slug.current}
            onClick={() => onChoice(garment.slug.current as GarmentSlug)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleContinue}
        disabled={!isEnabled}
        className={`block w-full text-center py-2.5 rounded-[20px] ${
          !isEnabled
            ? "bg-white text-[#A7A7A7] border border-black/30 cursor-auto"
            : "bg-[#006EFF] text-white"
        } hover:opacity-70 text-xl font-semibold`}
      >
        {labels.continue}
      </button>
    </>
  );
};

export default GarmentPageClient;
