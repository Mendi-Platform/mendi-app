"use client";

import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";
import sweater from "@/app/assets/icons/sweater.png";
import pants from "@/app/assets/icons/pants.png";
import dress from "@/app/assets/icons/dress.png";
import frakk from "@/app/assets/icons/frakk.png";
import leather from "@/app/assets/icons/leather.svg";
import { Garment } from "@/types/formData";
import useFormDataStore from "@/store";

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
    label: "Kjole/dress",
    value: Garment.DressAndSuit,
    logo: dress,
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
];

const GarmentPage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const updateFormData = store.updateFormData;

  const onChoice = (value: Garment) => {
    updateFormData({
      ...formData,
      garment: value,
    });
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
      <Button
        label="Fortsett"
        link="/order/service"
        prefetch
        disabled={formData.garment === Garment.None}
      />
    </>
  );
};

export default GarmentPage;