"use client";

import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";
import pants from "../../../assets/icons/pants.png";
import sweater from "../../../assets/icons/sweater.png";
import jacket from "../../../assets/icons/jacket.png";
import dress from "../../../assets/icons/dress.png";
import shirt from "../../../assets/icons/shirt.png";
import blazer from "../../../assets/icons/blazer.png";
import skirt from "../../../assets/icons/skirt.png";
import jeans from "../../../assets/icons/jeans.png";
import frakk from "../../../assets/icons/frakk.png";
import { Garment } from "@/types/formData";
import useFormDataStore from "@/store";
const garmentList = [
  {
    label: "Bukse",
    value: Garment.Pants,
    logo: pants,
  },
  {
    label: "Genser",
    value: Garment.Sweather,
    logo: sweater,
  },
  {
    label: "Jakke",
    value: Garment.Jacket,
    logo: jacket,
  },
  {
    label: "Kjole",
    value: Garment.Dress,
    logo: dress,
  },
  {
    label: "Skjorte",
    value: Garment.Shirt,
    logo: shirt,
  },
  {
    label: "Blazer",
    value: Garment.Blazer,
    logo: blazer,
  },
  {
    label: "Skjørt",
    value: Garment.Skirt,
    logo: skirt,
  },
  {
    label: "Jeans",
    value: Garment.Jeans,
    logo: jeans,
  },
  {
    label: "Kåpe/Frakk",
    value: Garment.Frakk,
    logo: frakk,
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
      <h1 className="font-medium text-lg mb-3">
        Hvilket plagg ønsker du å reparere
      </h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        Velg ett plagg. Du kan legge til et annet plagg senere.
      </p>
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
        link="/order/reparation"
        prefetch
        disabled={formData.garment === Garment.None}
      />
    </>
  );
};

export default GarmentPage;
