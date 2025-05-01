"use client";

import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";
import { RepairType, TwoOptionType } from "@/types/formData";
import useFormDataStore from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface OptionConfig {
  title: string;
  options: {
    label: string;
    value: string;
    subText?: string;
    price: number;
  }[];
}

const optionConfigs: Partial<Record<RepairType, OptionConfig>> = {
  [RepairType.ReplaceZipper]: {
    title: "Hvor lang er glidelåsen?",
    options: [
      {
        label: "Kort",
        value: TwoOptionType.Short,
        subText: "Opptil 30 cm",
        price: 399,
      },
      {
        label: "Lang",
        value: TwoOptionType.Long,
        subText: "Lengre enn 30 cm",
        price: 599,
      },
    ],
  },
  [RepairType.Hole]: {
    title: "Hvor stort er hullet?",
    options: [
      {
        label: "Liten",
        value: TwoOptionType.Small,
        subText: "Mindre enn en 5-kroner",
        price: 199,
      },
      {
        label: "Stor",
        value: TwoOptionType.Big,
        subText: "Større enn en 5-kroner",
        price: 299,
      },
    ],
  },
  [RepairType.Hemming]: {
    title: "Hvor mange lag har plagget?",
    options: [
      {
        label: "Ett lag",
        value: TwoOptionType.SingleLayer,
        subText: "Enkel tilspaning",
        price: 399,
      },
      {
        label: "Flere lag",
        value: TwoOptionType.MultipleLayers,
        subText: "Krever litt mer tid",
        price: 499,
      },
    ],
  },
  [RepairType.AdjustWaist]: {
    title: "Hvor mange lag skal tas inn?",
    options: [
      {
        label: "Ett lag",
        value: TwoOptionType.SingleLayer,
        price: 299,
      },
      {
        label: "To lag",
        value: TwoOptionType.MultipleLayers,
        price: 399,
      },
    ],
  },
};

const TwoOptionPage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const router = useRouter();
  const updateFormData = store.updateFormData;

  useEffect(() => {
    if (formData.repairType === RepairType.None) {
      router.replace('/order/service');
    }
  }, [formData.repairType, router]);

  const config = optionConfigs[formData.repairType];

  const onChoice = (option: string) => {
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        option,
      },
    });
  };

  if (!config) return null;

  return (
    <>
      <h1 className="font-medium text-lg mb-11">{config.title}</h1>
      <div className="flex flex-col gap-3.5 mb-14">
        {config.options.map((option) => (
          <ButtonOption
            key={option.value}
            label={option.label}
            subText={option.subText}
            price={option.price}
            active={formData.repairDetails?.option === option.value}
            onClick={() => onChoice(option.value)}
          />
        ))}
      </div>
      <Button
        label="Fortsett"
        link={
          formData.repairType === RepairType.Hemming || formData.repairType === RepairType.AdjustWaist 
            ? "/order/measurement"
            : formData.repairType === RepairType.ReplaceZipper || formData.repairType === RepairType.Hole
              ? "/order/additional-details"
              : "/order/material"
        }
        prefetch
        disabled={!formData.repairDetails?.option}
      />
    </>
  );
};

export default TwoOptionPage; 