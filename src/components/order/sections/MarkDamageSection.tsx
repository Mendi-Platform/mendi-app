"use client";

import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";

interface MarkDamageSectionProps {
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

export default function MarkDamageSection({ orderFlowConfig }: MarkDamageSectionProps) {
  const { language } = useLanguage();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  const labels = {
    title: language === 'nb' ? 'Merk skaden på plagget:' : 'Mark the damage on the garment:',
    hint: language === 'nb'
      ? 'Trykk på bildet for å markere hvor skaden er.'
      : 'Tap on the image to mark where the damage is.',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
    skip: language === 'nb' ? 'Hopp over' : 'Skip',
  };

  const handleContinue = () => {
    navigateToNext('mark-damage');
  };

  return (
    <div className="w-full max-w-md lg:max-w-2xl mx-auto">
      <h1 className="font-medium text-lg mb-3">{labels.title}</h1>
      <p className="text-sm text-[#797979] mb-8">{labels.hint}</p>

      {/* Placeholder for damage marking interface */}
      <div className="mb-14">
        <div className="aspect-[3/4] bg-[#F3F3F3] rounded-[18px] flex items-center justify-center border-2 border-dashed border-[#E5E5E5]">
          <div className="text-center text-[#797979]">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <p className="text-sm">
              {language === 'nb' ? 'Trykk for å markere skade' : 'Tap to mark damage'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleContinue}
          className="block w-full text-center py-2.5 rounded-[20px] bg-[#006EFF] text-white hover:opacity-70 text-xl font-semibold"
        >
          {labels.continue}
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="block w-full text-center py-2.5 rounded-[20px] bg-white text-[#797979] border border-[#E5E5E5] hover:border-[#006EFF] text-lg"
        >
          {labels.skip}
        </button>
      </div>
    </div>
  );
}
