"use client";

import { LinkButton } from "@/components/ui/button";
import ButtonOption from "@/components/ui/buttonOption";
import sweater from "@/app/assets/icons/sweater.png";
import pants from "@/app/assets/icons/pants.png";
import dress from "@/app/assets/icons/dress.png";
import suit from "@/app/assets/icons/suit.png";
import frakk from "@/app/assets/icons/frakk.png";
import leather from "@/app/assets/icons/leather.svg";
import curtains from "@/app/assets/icons/curtain.svg";
import { Garment, Category } from "@/types/formData";
import useFormDataStore from "@/store";
import Image from "next/image";

const garmentList = [
  {
    label: "Overdel",
    value: Garment.UpperBody,
    logo: sweater,
  },
  {
    label: "Underdel",
    value: Garment.LowerBody,
    logo: pants,
  },
  {
    label: "Kjole",
    value: Garment.Kjole,
    logo: dress,
  },
  {
    label: "Dress",
    value: Garment.Dress,
    logo: suit,
  },
  {
    label: "Jakke/Yttertøy",
    value: Garment.OuterWear,
    logo: frakk,
  },
  {
    label: "Skinnplagg",
    value: Garment.LeatherItems,
    logo: leather,
  },
  {
    label: "Gardiner",
    value: Garment.Curtains,
    logo: curtains,
  },
];

const GarmentPage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const updateFormField = store.updateFormField;

  const onChoice = (value: Garment) => {
    updateFormField("garment", value);
    if (value === Garment.OuterWear) {
      updateFormField("category", Category.Premium);
    } else {
      updateFormField("category", Category.None);
    }
  };

  return (
    <>
      <h1 className="font-medium text-lg mb-11">
        Hvilken type plagg vil du registrere?
      </h1>
      <div className="flex flex-col gap-3.5 mb-14">
        {garmentList.map((item) => (
          <ButtonOption
            key={item.value}
            label={item.label}
            logo={item.logo}
            active={formData.garment === item.value}
            onClick={() => onChoice(item.value)}
          />
        ))}
      </div>
      <LinkButton
        label="Fortsett"
        link="/order/service"
        prefetch
        disabled={formData.garment === Garment.None}
      />
    </>
  );
};

export default GarmentPage;