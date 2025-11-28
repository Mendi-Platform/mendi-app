"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";

interface MeasurementSectionProps {
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

export default function MeasurementSection({ orderFlowConfig }: MeasurementSectionProps) {
  const { language } = useLanguage();
  const { formData, updateRepairDetails } = useCart();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  const [measurement, setMeasurement] = useState(formData.repairDetails.measurements || '');

  const labels = {
    title: language === 'nb' ? 'Oppgi mål:' : 'Enter measurement:',
    placeholder: language === 'nb' ? 'F.eks. 5 cm' : 'E.g. 5 cm',
    hint: language === 'nb'
      ? 'Angi hvor mye plagget skal tas opp eller legges ned.'
      : 'Enter how much the garment should be taken up or let down.',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
  };

  const handleChange = (value: string) => {
    setMeasurement(value);
    updateRepairDetails('measurements', value);
  };

  const handleContinue = () => {
    navigateToNext('measurement');
  };

  const isEnabled = measurement.trim() !== '';

  return (
    <div className="w-full max-w-md lg:max-w-2xl mx-auto">
      <h1 className="font-medium text-lg mb-3">{labels.title}</h1>
      <p className="text-sm text-[#797979] mb-8">{labels.hint}</p>

      <div className="mb-14">
        <input
          type="text"
          value={measurement}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={labels.placeholder}
          className="w-full p-4 rounded-[18px] border border-[#E5E5E5] focus:border-[#006EFF] focus:outline-none text-lg"
        />
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
