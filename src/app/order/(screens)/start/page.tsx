"use client";

import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";
import clothes from "@/app/assets/icons/clothes.svg";
import curtains from "@/app/assets/icons/curtain.svg";
import { MainCategory } from "@/types/formData";
import useFormDataStore from "@/store";

const categoryList = [
  {
    label: "Klær",
    value: MainCategory.Clothes,
    logo: clothes,
  },
  {
    label: "Andre tekstiler",
    value: MainCategory.OtherTextiles,
    logo: curtains,
  },
];

const StartPage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const updateFormData = store.updateFormData;

  const onChoice = (value: MainCategory) => {
    updateFormData({
      ...formData,
      mainCategory: value,
    });
  };

  return (
    <>
      <h1 className="font-medium text-lg mb-3">
        Hva trenger du hjelp med?
      </h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        Velg ett alternativ. Du kan legge til et annet senere.
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        {categoryList.map((item) => (
          <ButtonOption
            key={item.value}
            label={item.label}
            logo={item.logo}
            active={formData.mainCategory === item.value}
            onClick={() => onChoice(item.value)}
          />
        ))}
      </div>
      <Button
        label="Fortsett"
        link="/order/garment"
        prefetch
        disabled={formData.mainCategory === MainCategory.None}
      />
    </>
  );
};

export default StartPage;
