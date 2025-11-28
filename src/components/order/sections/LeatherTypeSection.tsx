"use client";

import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";

interface LeatherTypeSectionProps {
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

const LEATHER_TYPES = [
  { slug: 'normal', labelNb: 'Ekte skinn', labelEn: 'Genuine leather' },
  { slug: 'faux-leather', labelNb: 'Kunstskinn', labelEn: 'Faux leather' },
  { slug: 'silk', labelNb: 'Semsket skinn', labelEn: 'Suede' },
  { slug: 'thick', labelNb: 'Tykt skinn', labelEn: 'Thick leather' },
] as const;

export default function LeatherTypeSection({ orderFlowConfig }: LeatherTypeSectionProps) {
  const { language } = useLanguage();
  const { formData, updateFormField } = useCart();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  const labels = {
    title: language === 'nb' ? 'Hvilken type skinn?' : 'What type of leather?',
    hint: language === 'nb'
      ? 'Velg skinntypen for plagget ditt.'
      : 'Select the leather type for your garment.',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
  };

  const selectedType = formData.materialSlug || '';

  const handleSelect = (slug: typeof LEATHER_TYPES[number]['slug']) => {
    updateFormField('materialSlug', slug);
  };

  const handleContinue = () => {
    navigateToNext('leather-type');
  };

  const isEnabled = selectedType !== '';

  return (
    <div className="w-full max-w-md lg:max-w-2xl mx-auto">
      <h1 className="font-medium text-lg mb-3">{labels.title}</h1>
      <p className="text-sm text-[#797979] mb-8">{labels.hint}</p>

      <div className="grid grid-cols-2 gap-3 mb-14">
        {LEATHER_TYPES.map((type) => (
          <button
            key={type.slug}
            type="button"
            onClick={() => handleSelect(type.slug)}
            className={`p-4 rounded-[18px] border-2 text-left transition-all ${
              selectedType === type.slug
                ? 'border-[#006EFF] bg-[#E3EEFF]'
                : 'border-[#E5E5E5] bg-white hover:border-[#006EFF]/50'
            }`}
          >
            <span className="font-medium text-sm">
              {language === 'nb' ? type.labelNb : type.labelEn}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!isEnabled}
        className={`block w-full text-center py-2.5 rounded-[20px] ${
          !isEnabled
            ? "bg-white text-[#A7A7A7] border border-black/30 cursor-auto"
            : "bg-[#006EFF] text-white hover:opacity-70"
        } text-xl font-semibold`}
      >
        {labels.continue}
      </button>
    </div>
  );
}
