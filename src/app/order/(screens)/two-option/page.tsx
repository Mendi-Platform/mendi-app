"use client";

import ButtonWithDetails from "@/components/ui/button-with-details";
import { RepairType, TwoOptionType } from "@/types/formData";
import useFormDataStore from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Category } from "@/types/formData";

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
        subText: "Enkel tilspaning",
        price: 299,
      },
      {
        label: "To lag",
        value: TwoOptionType.MultipleLayers,
        subText: "Krever litt mer tid",
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
    if (!config) return;
    const selected = config.options.find(o => o.value === option);
    if (!selected) return;

    // Calculate price based on category
    let finalPrice = selected.price;
    if (formData.category === Category.Premium) {
      finalPrice += 100; // Premium adds 100kr to base price
    }

    updateFormData({
      ...formData,
      price: finalPrice,
      repairDetails: {
        ...formData.repairDetails,
        option,
        detailsText: `${selected.label}${selected.subText ? ` (${selected.subText})` : ''}`,
      },
    });
  };

  const handleContinue = () => {
    if (formData.repairType === RepairType.Hole) {
      router.push("/order/mark-damage");
    } else if (formData.repairType === RepairType.Hemming || formData.repairType === RepairType.AdjustWaist) {
      router.push("/order/measurement");
    } else {
      router.push("/order/add-image");
    }
  };

  if (!config) return null;

  return (
    <>
      <h1 className="font-medium text-lg mb-11">{config.title}</h1>
      <div className="flex flex-col gap-3.5 mb-14">
        {config.options.map((option) => (
          <ButtonWithDetails
            key={option.value}
            label={option.label}
            subText={option.subText}
            price={option.price}
            active={formData.repairDetails?.option === option.value}
            onClick={() => onChoice(option.value)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleContinue}
        disabled={!formData.repairDetails?.option}
        className="block w-full text-center py-2.5 rounded-[20px] bg-[#006EFF] text-white hover:opacity-70 text-xl font-semibold"
      >
        Fortsett
      </button>
    </>
  );
};

export default TwoOptionPage; 