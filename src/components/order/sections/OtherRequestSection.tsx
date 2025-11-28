"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";

interface OtherRequestSectionProps {
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

export default function OtherRequestSection({ orderFlowConfig }: OtherRequestSectionProps) {
  const { language } = useLanguage();
  const { formData, updateFormField } = useCart();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  const [request, setRequest] = useState(formData.otherRequest || '');

  const labels = {
    title: language === 'nb' ? 'Beskriv din forespørsel:' : 'Describe your request:',
    placeholder: language === 'nb'
      ? 'Fortell oss hva du trenger hjelp med...'
      : 'Tell us what you need help with...',
    hint: language === 'nb'
      ? 'Beskriv reparasjonen eller endringen du ønsker så detaljert som mulig.'
      : 'Describe the repair or alteration you want as detailed as possible.',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
  };

  const handleChange = (value: string) => {
    setRequest(value);
    updateFormField('otherRequest', value);
  };

  const handleContinue = () => {
    navigateToNext('other-request-info');
  };

  const isEnabled = request.trim().length >= 10;

  return (
    <div className="w-full max-w-md lg:max-w-2xl mx-auto">
      <h1 className="font-medium text-lg mb-3">{labels.title}</h1>
      <p className="text-sm text-[#797979] mb-8">{labels.hint}</p>

      <div className="mb-14">
        <textarea
          value={request}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={labels.placeholder}
          rows={6}
          className="w-full p-4 rounded-[18px] border border-[#E5E5E5] focus:border-[#006EFF] focus:outline-none text-base resize-none"
        />
        {request.length > 0 && request.length < 10 && (
          <p className="text-xs text-[#E17055] mt-2">
            {language === 'nb'
              ? `Minst 10 tegn (${request.length}/10)`
              : `At least 10 characters (${request.length}/10)`}
          </p>
        )}
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
