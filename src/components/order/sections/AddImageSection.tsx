"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";

interface AddImageSectionProps {
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

export default function AddImageSection({ orderFlowConfig }: AddImageSectionProps) {
  const { language } = useLanguage();
  const { updateFormField } = useCart();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const labels = {
    title: language === 'nb' ? 'Legg til bilde:' : 'Add image:',
    hint: language === 'nb'
      ? 'Last opp et bilde av plagget eller skaden.'
      : 'Upload a photo of the garment or damage.',
    uploadButton: language === 'nb' ? 'Velg bilde' : 'Choose image',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
    skip: language === 'nb' ? 'Hopp over' : 'Skip',
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        updateFormField('imageUrl', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    navigateToNext('add-image');
  };

  return (
    <div className="w-full max-w-md lg:max-w-2xl mx-auto">
      <h1 className="font-medium text-lg mb-3">{labels.title}</h1>
      <p className="text-sm text-[#797979] mb-8">{labels.hint}</p>

      <div className="mb-14">
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full aspect-square object-cover rounded-[18px]"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null);
                updateFormField('imageUrl', '');
              }}
              className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50"
            >
              <span className="text-red-500 text-lg">&times;</span>
            </button>
          </div>
        ) : (
          <label className="block cursor-pointer">
            <div className="aspect-square bg-[#F3F3F3] rounded-[18px] flex flex-col items-center justify-center border-2 border-dashed border-[#E5E5E5] hover:border-[#006EFF] transition-colors">
              <svg
                className="w-16 h-16 mb-4 text-[#A7A7A7]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-[#006EFF] font-medium">{labels.uploadButton}</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleContinue}
          className="block w-full text-center py-2.5 rounded-[20px] bg-[#006EFF] text-white hover:opacity-70 text-xl font-semibold"
        >
          {labels.continue}
        </button>
        {!imagePreview && (
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
