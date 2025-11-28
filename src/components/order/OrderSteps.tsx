"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderFlow } from "@/hooks/useOrderFlow";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import { ChevronLeft } from "lucide-react";
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";
import { getLocalizedValue } from "@/sanity/lib/types";

interface OrderStepsProps {
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  } | null;
}

const OrderSteps = ({ orderFlowConfig }: OrderStepsProps) => {
  const { language } = useLanguage();
  const flowState = useOrderFlow(orderFlowConfig);
  const { navigateToPrevious, canGoBack } = useOrderNavigation(orderFlowConfig);

  if (!flowState || !orderFlowConfig) return null;

  const { currentStep, progress } = flowState;

  // Don't show on confirmation
  if (currentStep.slug.current === orderFlowConfig.confirmationStepSlug) {
    return null;
  }

  const labels = {
    previous: language === 'nb' ? 'Forrige' : 'Previous',
  };

  return (
    <div className="mb-8 max-w-md lg:max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="h-1.5 bg-bg-default rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          {canGoBack && (
            <button
              onClick={navigateToPrevious}
              className="flex items-center gap-1 text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              <ChevronLeft size={14} />
              {labels.previous}
            </button>
          )}
          <div className={`text-text-secondary ${!canGoBack ? "w-full text-center" : "ml-auto"}`}>
            {getLocalizedValue(currentStep.label, language)} ({Math.round(progress)}%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSteps;
