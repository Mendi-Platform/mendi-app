"use client";

import GridButtonOption from "@/components/ui/gridButtonOption";
import { useCart } from "@/contexts/CartContext";
import type { SanityRepairType, OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";
import { getLocalizedValue } from "@/sanity/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { RepairTypeSlug } from "@/types/formData";

interface ServiceSectionProps {
  repairTypes: SanityRepairType[];
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

// Repair types available for curtains
const curtainRepairSlugs = ['hemming', 'other-request'];

export default function ServiceSection({ repairTypes, orderFlowConfig }: ServiceSectionProps) {
  const { language } = useLanguage();
  const { formData, updateFormField } = useCart();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  const onChoice = (slug: RepairTypeSlug) => {
    updateFormField("repairTypeSlug", slug);
  };

  const handleContinue = () => {
    navigateToNext('service'); // Current step slug
  };

  // Filter repair types based on garment (curtains have limited options)
  const isCurtains = formData.garmentSlug === 'curtains';
  const filteredRepairTypes = isCurtains
    ? repairTypes.filter(rt => curtainRepairSlugs.includes(rt.slug.current))
    : repairTypes;

  // i18n labels
  const labels = {
    title: language === 'nb'
      ? 'Hvordan vil du at plagget skal repareres?'
      : 'How would you like the garment to be repaired?',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
  };

  const isEnabled = formData.repairTypeSlug !== '';

  return (
    <>
      <h1 className="font-medium text-lg mb-11">
        {labels.title}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-14">
        {filteredRepairTypes.map((repairType) => (
          <GridButtonOption
            key={repairType._id}
            label={getLocalizedValue(repairType.label, language)}
            active={formData.repairTypeSlug === repairType.slug.current}
            onClick={() => onChoice(repairType.slug.current as RepairTypeSlug)}
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
}
