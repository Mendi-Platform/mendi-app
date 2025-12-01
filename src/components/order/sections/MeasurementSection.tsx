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

  const [measurement, setMeasurement] = useState(formData.repairDetails.measurements || "");
  const [details, setDetails] = useState(formData.repairDetails.detailsText || "");

  const labels = {
    title: language === "nb" ? "Hvordan skal plagget tilpasses?" : "How should the garment be adjusted?",
    intro: language === "nb"
      ? "Legg inn målet ditt og eventuelle detaljer på samme sted. Du kan finpusse teksten senere hvis du vil."
      : "Add your measurement and any extra details in one go. You can fine tune later if needed.",
    measurementLabel: language === "nb" ? "Mål" : "Measurement",
    measurementPlaceholder: language === "nb" ? "F.eks. 5 cm kortere" : "E.g. 5 cm shorter",
    detailsLabel: language === "nb" ? "Tilleggsdetaljer (valgfritt)" : "Additional details (optional)",
    detailsPlaceholder: language === "nb"
      ? "Beskriv hvordan du vil ha plagget tilpasset, eller andre ønsker."
      : "Describe how you want the garment adjusted, or other requests.",
    helper: language === "nb"
      ? "Tips: Legg gjerne ved informasjon om hvordan plagget sitter nå (f.eks. for langt i beina)."
      : "Tip: Share how it fits right now (e.g. legs are too long) to guide the tailor.",
    continue: language === "nb" ? "Fortsett" : "Continue",
  };

  const handleChange = (value: string) => {
    setMeasurement(value);
    updateRepairDetails("measurements", value);
  };

  const handleDetailsChange = (value: string) => {
    setDetails(value);
    updateRepairDetails("detailsText", value);
  };

  const handleContinue = () => {
    navigateToNext("measurement");
  };

  const isEnabled = measurement.trim() !== "";

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">{labels.title}</h1>
        <p className="text-sm text-gray-600 max-w-2xl">{labels.intro}</p>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900" htmlFor="measurement-input">
            {labels.measurementLabel}
          </label>
          <input
            id="measurement-input"
            type="text"
            value={measurement}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={labels.measurementPlaceholder}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-inner focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-900" htmlFor="measurement-details">
              {labels.detailsLabel}
            </label>
            <span className="text-xs uppercase tracking-[0.08em] text-slate-500">
              {language === "nb" ? "Valgfritt" : "Optional"}
            </span>
          </div>
          <textarea
            id="measurement-details"
            value={details}
            onChange={(e) => handleDetailsChange(e.target.value)}
            placeholder={labels.detailsPlaceholder}
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-inner focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition resize-none"
          />
          <p className="text-sm text-slate-600">{labels.helper}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!isEnabled}
        className={`w-full rounded-[18px] text-lg font-semibold transition-all duration-150 ${
          isEnabled
            ? "bg-[#006EFF] text-white shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-[#006EFF]"
            : "border border-gray-200 bg-white text-[#A7A7A7] cursor-not-allowed"
        }`}
      >
        <span className="block w-full py-3">{labels.continue}</span>
      </button>
    </div>
  );
}
