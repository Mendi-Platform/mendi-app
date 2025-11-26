"use client";

import { LinkButton } from "@/components/ui/button";
import ButtonOption from "@/components/ui/buttonOption";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import type { SanityGarment } from "@/sanity/lib/types";
import { getLocalizedValue } from "@/sanity/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import type { GarmentSlug } from "@/types/formData";

interface GarmentPageClientProps {
  garments: SanityGarment[];
}

const GarmentPageClient = ({ garments }: GarmentPageClientProps) => {
  const { language } = useLanguage();
  const { formData, updateFormField } = useCart();

  const onChoice = (slug: GarmentSlug) => {
    updateFormField("garmentSlug", slug);
    // Auto-set premium category for outer-wear
    if (slug === 'outer-wear') {
      updateFormField("categorySlug", 'premium');
    } else {
      updateFormField("categorySlug", '');
    }
  };

  // i18n labels
  const labels = {
    title: language === 'nb'
      ? 'Hvilken type plagg vil du registrere?'
      : 'What type of garment would you like to register?',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
  };

  return (
    <>
      <h1 className="font-medium text-lg mb-11">
        {labels.title}
      </h1>
      <div className="flex flex-col gap-3.5 mb-14">
        {garments.map((garment) => (
          <ButtonOption
            key={garment._id}
            label={getLocalizedValue(garment.label, language)}
            logo={garment.icon}
            active={formData.garmentSlug === garment.slug.current}
            onClick={() => onChoice(garment.slug.current as GarmentSlug)}
          />
        ))}
      </div>
      <LinkButton
        label={labels.continue}
        link="/order/service"
        prefetch
        disabled={formData.garmentSlug === ''}
      />
    </>
  );
};

export default GarmentPageClient;
