"use client";

import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";
import { RepairType } from "@/types/formData";
import useFormDataStore from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const measurementOptions = [
  {
    label: "Send mål",
    value: "measurements",
    subText: "Oppgi hvordan du ønsker at plagget skal tilpasses i centimeter.",
  },
  {
    label: "Send med sikkerhetsnål",
    value: "pin",
    subText: "Sett inn en eller flere sikkerhetsnåler i plagget.",
  },
  {
    label: "Send med referanseplagg",
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
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        measurementMethod: value,
      },
    });
  };

  return (
    <>
      <h1 className="font-medium text-lg mb-3">
        Hjelp oss med å få den perfekte passformen:
      </h1>
      <div className="flex flex-col gap-3.5 mb-14">
        {measurementOptions.map((option) => (
          <ButtonOption
            key={option.value}
            label={option.label}
            subText={option.subText}
            active={formData.repairDetails?.measurementMethod === option.value}
            onClick={() => onChoice(option.value)}
          />
        ))}
      </div>
      <Button
        label="Fortsett"
        link="/order/measurement-details"
        prefetch
        disabled={!formData.repairDetails?.measurementMethod}
      />
    </>
  );
};

export default MeasurementPage; 