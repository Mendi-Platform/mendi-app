"use client";

import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";
import type { TwoOptionSlug } from "@/types/formData";

interface TwoOptionSectionProps {
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

export default function TwoOptionSection({ orderFlowConfig }: TwoOptionSectionProps) {
  const { language } = useLanguage();
  const { formData, updateRepairDetails } = useCart();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  const labels = {
    title: language === 'nb' ? 'Velg et alternativ:' : 'Choose an option:',
    small: language === 'nb' ? 'Liten' : 'Small',
    big: language === 'nb' ? 'Stor' : 'Big',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
  };

  const selectedOption = formData.repairDetails.option || '';

  const handleSelect = (option: TwoOptionSlug) => {
    updateRepairDetails('option', option);
  };

  const handleContinue = () => {
    navigateToNext('two-option');
  };

  const isEnabled = selectedOption !== '';

  return (
    <div className="w-full max-w-md lg:max-w-2xl mx-auto">
      <h1 className="font-medium text-lg mb-11">{labels.title}</h1>

      <div className="flex flex-col gap-4 mb-14">
        <button
          type="button"
          onClick={() => handleSelect('small')}
          className={`p-4 rounded-[18px] border-2 text-left transition-all ${
            selectedOption === 'small'
              ? 'border-[#006EFF] bg-[#E3EEFF]'
              : 'border-[#E5E5E5] bg-white hover:border-[#006EFF]/50'
          }`}
        >
          <span className="font-medium">{labels.small}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect('big')}
          className={`p-4 rounded-[18px] border-2 text-left transition-all ${
            selectedOption === 'big'
              ? 'border-[#006EFF] bg-[#E3EEFF]'
              : 'border-[#E5E5E5] bg-white hover:border-[#006EFF]/50'
          }`}
        >
          <span className="font-medium">{labels.big}</span>
        </button>
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
