"use client";

import ButtonWithDetails from "@/components/ui/button-with-details";
import { RepairType } from "@/types/formData";
import useFormDataStore from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const measurementOptions = [
  {
    label: "Send mål",
    value: "measurements",
    subText: "Oppgi hvordan du ønsker at plagget skal tilpasses i centimeter.",
    variant: "input",
    placeholder: "f.eks: Legg opp 5 cm",
  },
  {
    label: "Send med sikkerhetsnål",
    value: "pin",
    subText: "Sett inn en eller flere sikkerhetsnåler i plagget.",
  },
  {
    label: "Send tilsvarende plagg",
    value: "reference",
    subText: "Send med et plagg i samme stoff og passform som passer deg perfekt.",
  },
];

const MeasurementPage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const updateFormData = store.updateFormData;
  const router = useRouter();

  useEffect(() => {
    if (formData.repairType !== RepairType.Hemming && formData.repairType !== RepairType.AdjustWaist) {
      router.replace('/order/service');
    }
  }, [formData.repairType, router]);

  const onChoice = (value: string) => {
    if (formData.repairDetails?.measurementMethod === value) return;
    
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        measurementMethod: value,
        measurements: undefined,
        detailsText: undefined,
      },
    });
  };

  const handleInputChange = (value: string) => {
    if (!formData.repairDetails?.measurementMethod) return;
    
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        measurements: value,
      },
    });
  };

  const handleInputSubmit = (value: string) => {
    if (!formData.repairDetails?.measurementMethod) return;
    
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        measurements: value,
        detailsText: value,
      },
    });
  };

  const handleContinue = () => {
    if (formData.repairDetails?.measurementMethod === "measurements") {
      if (!formData.repairDetails.measurements) return;
    }
    router.push("/order/add-image");
  };

  return (
    <>
      <h1 className="font-medium text-lg mb-8">Hva slags stoffstype er det?</h1>
      <div className="flex flex-col gap-5 mb-20">
        {measurementOptions.map((option) => (
          <ButtonWithDetails
            key={option.value}
            label={option.label}
            subText={option.subText}
            active={formData.repairDetails?.measurementMethod === option.value}
            onClick={() => onChoice(option.value)}
            variant={option.variant as "default" | "input"}
            inputPlaceholder={option.placeholder}
            inputValue={formData.repairDetails?.measurements}
            onInputChange={handleInputChange}
            onInputSubmit={handleInputSubmit}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleContinue}
        disabled={!formData.repairDetails?.measurementMethod || 
          (formData.repairDetails.measurementMethod === "measurements" && !formData.repairDetails.measurements)}
        className="block w-full text-center py-2.5 rounded-[20px] bg-[#006EFF] text-white hover:opacity-70 text-xl font-semibold disabled:bg-white disabled:text-[#A7A7A7] disabled:border disabled:border-black/30"
      >
        Fortsett
      </button>
    </>
  );
};

export default MeasurementPage; 