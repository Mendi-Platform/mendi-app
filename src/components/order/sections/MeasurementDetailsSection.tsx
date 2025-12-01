"use client";

import { useEffect, useState } from "react";
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

  const [details, setDetails] = useState(formData.repairDetails.detailsText || "");
  const [hasNavigated, setHasNavigated] = useState(false);

  const labels = {
    title: language === "nb" ? "Viderekobler…" : "Redirecting…",
    description: language === "nb"
      ? "Mål og detaljer legges nå inn på samme side. Du blir sendt videre automatisk."
      : "Measurements and details now live on the same page. We’ll move you forward automatically.",
    button: language === "nb" ? "Fortsett" : "Continue",
  };

  const handleContinue = () => {
    updateRepairDetails("detailsText", details);
    navigateToNext("measurement-details");
    setHasNavigated(true);
  };

  useEffect(() => {
    if (!hasNavigated) {
      handleContinue();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNavigated]);

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-slate-50 to-[#E7F1FF] shadow-sm p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-2">{labels.title}</h1>
        <p className="text-sm text-gray-600">{labels.description}</p>
      </div>
      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-6 space-y-3">
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder=""
          rows={3}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-inner focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition resize-none"
        />
        <button
          type="button"
          onClick={handleContinue}
          className="w-full rounded-[18px] bg-[#006EFF] text-white text-lg font-semibold py-3 shadow hover:-translate-y-0.5 transition"
        >
          {labels.button}
        </button>
      </div>
    </div>
  );
}
