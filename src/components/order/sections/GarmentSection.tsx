"use client";

import GridButtonOption from "@/components/ui/gridButtonOption";
import { useCart } from "@/contexts/CartContext";
import type { SanityGarment, OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";
import { getLocalizedValue } from "@/sanity/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { GarmentSlug } from "@/types/formData";

interface GarmentSectionProps {
  garments: SanityGarment[];
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

export default function GarmentSection({ garments, orderFlowConfig }: GarmentSectionProps) {
  const { language } = useLanguage();
  const { formData, updateFormField } = useCart();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  const onChoice = (slug: GarmentSlug) => {
    updateFormField("garmentSlug", slug);
    // Auto-set premium category for outer-wear
    const categorySlug = slug === 'outer-wear' ? 'premium' : '';
    updateFormField("categorySlug", categorySlug);
    navigateToNext('garment', {
      garmentSlug: slug,
      categorySlug,
    });
  };

  // i18n labels
  const labels = {
    title: language === 'nb'
      ? 'Hvilken type plagg vil du registrere?'
      : 'What type of garment would you like to register?',
  };

  return (
    <>
      <h1 className="font-medium text-lg mb-11">
        {labels.title}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
    </>
  );
}
