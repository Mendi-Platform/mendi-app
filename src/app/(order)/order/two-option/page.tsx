"use client";

import ButtonWithDetails from "@/components/ui/button-with-details";
import type { RepairTypeSlug, TwoOptionSlug } from "@/types/formData";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface OptionConfig {
  title: string;
  options: {
    label: string;
    value: TwoOptionSlug;
    subText?: string;
    price: number;
  }[];
}

const optionConfigs: Partial<Record<RepairTypeSlug, OptionConfig>> = {
  'replace-zipper': {
    title: "Hvor lang er glidelåsen?",
    options: [
      {
        label: "Kort",
        value: 'short',
        subText: "Opptil 30 cm",
        price: 399,
      },
      {
        label: "Lang",
        value: 'long',
        subText: "Lengre enn 30 cm",
        price: 599,
      },
    ],
  },
  'hole': {
    title: "Hvor stort er hullet?",
    options: [
      {
        label: "Liten",
        value: 'small',
        subText: "Mindre enn en 5-kroner",
        price: 199,
      },
      {
        label: "Stor",
        value: 'big',
        subText: "Større enn en 5-kroner",
        price: 299,
      },
    ],
  },
  'hemming': {
    title: "Hvor mange lag har plagget?",
    options: [
      {
        label: "Ett lag",
        value: 'single',
        subText: "Enkel tilspaning",
        price: 399,
      },
      {
        label: "Flere lag",
        value: 'multiple',
        subText: "Krever litt mer tid",
        price: 499,
      },
    ],
  },
  'adjust-waist': {
    title: "Hvor mange lag skal tas inn?",
    options: [
      {
        label: "Ett lag",
        value: 'single',
        subText: "Enkel tilspaning",
        price: 299,
      },
      {
        label: "To lag",
        value: 'multiple',
        subText: "Krever litt mer tid",
        price: 399,
      },
    ],
  },
};

const TwoOptionPage = () => {
  const { formData, updateFormData } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (formData.repairTypeSlug === '') {
      router.replace('/order/service');
    }
  }, [formData.repairTypeSlug, router]);

  const config = optionConfigs[formData.repairTypeSlug];

  const onChoice = (option: TwoOptionSlug) => {
    if (!config) return;
    const selected = config.options.find(o => o.value === option);
    if (!selected) return;

    // Calculate price based on category
    let finalPrice = selected.price;
    if (formData.categorySlug === 'premium') {
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
    if (formData.repairTypeSlug === 'hole') {
      router.push("/order/mark-damage");
    } else if (formData.repairTypeSlug === 'hemming' || formData.repairTypeSlug === 'adjust-waist') {
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