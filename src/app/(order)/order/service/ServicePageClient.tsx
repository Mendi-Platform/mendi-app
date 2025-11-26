"use client";

import ButtonOption from "@/components/ui/buttonOption";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import type { SanityRepairType } from "@/sanity/lib/types";
import { getLocalizedValue } from "@/sanity/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import type { RepairTypeSlug } from "@/types/formData";

interface ServicePageClientProps {
  repairTypes: SanityRepairType[];
}

// Mapping of repair type slugs to their next page routes
const repairTypeRoutes: Record<string, string> = {
  'replace-zipper': '/order/two-option',
  'sew-button': '/order/quantity',
  'hole': '/order/two-option',
  'belt-loops': '/order/quantity',
  'hemming': '/order/two-option',
  'adjust-waist': '/order/two-option',
  'other-request': '/order/other-request-info',
};

// Repair types available for curtains
const curtainRepairSlugs = ['hemming', 'other-request'];

const ServicePageClient = ({ repairTypes }: ServicePageClientProps) => {
  const { language } = useLanguage();
  const { formData, updateFormField } = useCart();
  const router = useRouter();

  const onChoice = (slug: RepairTypeSlug) => {
    updateFormField("repairTypeSlug", slug);
  };

  const handleContinue = () => {
    const nextPage = repairTypeRoutes[formData.repairTypeSlug] || '/order/category';
    router.push(nextPage);
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
      <div className="flex flex-col gap-3.5 mb-14">
        {filteredRepairTypes.map((repairType) => (
          <ButtonOption
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
};

export default ServicePageClient;
