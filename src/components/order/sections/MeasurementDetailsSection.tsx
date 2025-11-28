"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";

interface MeasurementDetailsSectionProps {
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

export default function MeasurementDetailsSection({ orderFlowConfig }: MeasurementDetailsSectionProps) {
  const { language } = useLanguage();
  const { formData, updateRepairDetails } = useCart();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  const [details, setDetails] = useState(formData.repairDetails.detailsText || '');

  const labels = {
    title: language === 'nb' ? 'Tilleggsdetaljer om mål:' : 'Additional measurement details:',
    placeholder: language === 'nb'
      ? 'Beskriv eventuelle spesielle ønsker...'
      : 'Describe any special requests...',
    hint: language === 'nb'
      ? 'Valgfritt: Legg til mer informasjon om hvordan du vil ha plagget tilpasset.'
      : 'Optional: Add more information about how you want the garment adjusted.',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
    skip: language === 'nb' ? 'Hopp over' : 'Skip',
  };

  const handleChange = (value: string) => {
    setDetails(value);
    updateRepairDetails('detailsText', value);
  };

  const handleContinue = () => {
    navigateToNext('measurement-details');
  };

  return (
    <div className="w-full max-w-md lg:max-w-2xl mx-auto">
      <h1 className="font-medium text-lg mb-3">{labels.title}</h1>
      <p className="text-sm text-[#797979] mb-8">{labels.hint}</p>

      <div className="mb-14">
        <textarea
          value={details}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={labels.placeholder}
          rows={4}
          className="w-full p-4 rounded-[18px] border border-[#E5E5E5] focus:border-[#006EFF] focus:outline-none text-base resize-none"
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleContinue}
          className="block w-full text-center py-2.5 rounded-[20px] bg-[#006EFF] text-white hover:opacity-70 text-xl font-semibold"
        >
          {labels.continue}
        </button>
        {!details && (
          <button
            type="button"
            onClick={handleContinue}
            className="block w-full text-center py-2.5 rounded-[20px] bg-white text-[#797979] border border-[#E5E5E5] hover:border-[#006EFF] text-lg"
          >
            {labels.skip}
          </button>
        )}
      </div>
    </div>
  );
}
