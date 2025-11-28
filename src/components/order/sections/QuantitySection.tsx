"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";

interface QuantitySectionProps {
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

export default function QuantitySection({ orderFlowConfig }: QuantitySectionProps) {
  const { language } = useLanguage();
  const { formData, updateRepairDetails } = useCart();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  const [quantity, setQuantity] = useState(formData.repairDetails.quantity || 1);

  const labels = {
    title: language === 'nb' ? 'Antall:' : 'Quantity:',
    hint: language === 'nb'
      ? 'Hvor mange reparasjoner av samme type?'
      : 'How many repairs of the same type?',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      updateRepairDetails('quantity', newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    updateRepairDetails('quantity', newQty);
  };

  const handleContinue = () => {
    navigateToNext('quantity');
  };

  return (
    <div className="w-full max-w-md lg:max-w-2xl mx-auto">
      <h1 className="font-medium text-lg mb-3">{labels.title}</h1>
      <p className="text-sm text-[#797979] mb-8">{labels.hint}</p>

      <div className="flex items-center justify-center gap-6 mb-14">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
            quantity <= 1
              ? 'bg-[#F3F3F3] text-[#A7A7A7] cursor-not-allowed'
              : 'bg-[#E3EEFF] text-[#006EFF] hover:bg-[#006EFF] hover:text-white'
          }`}
        >
          -
        </button>

        <span className="text-4xl font-semibold min-w-[60px] text-center">
          {quantity}
        </span>

        <button
          type="button"
          onClick={handleIncrease}
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold bg-[#E3EEFF] text-[#006EFF] hover:bg-[#006EFF] hover:text-white transition-all"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        className="block w-full text-center py-2.5 rounded-[20px] bg-[#006EFF] text-white hover:opacity-70 text-xl font-semibold"
      >
        {labels.continue}
      </button>
    </div>
  );
}
