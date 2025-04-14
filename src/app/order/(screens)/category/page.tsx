"use client";

import Button from "../../(components)/button";
import CategoryCard from "./categoryCard";
import useFormDataStore from "@/store";
import { Category } from "@/types/formData";

const OrderServicePage = () => {
  const store = useFormDataStore();

  const formData = store.formData;
  const updateFormData = store.updateFormData;

  const onChoice = (value: Category) => {
    updateFormData({
      ...formData,
      category: value,
    });
  };

  return (
    <>
      <h1 className="font-medium text-lg mb-3">Velg etter dine behov:</h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        Velg alternativet som passer deg best.
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        <CategoryCard
          formData={formData}
          onClick={() => onChoice(Category.Standard)}
          isActive={formData.category === Category.Standard}
          title="Standard"
          description="Kvalitet til en god pris."
          price={300}
        />
        <CategoryCard
          formData={formData}
          onClick={() => onChoice(Category.Premium)}
          isActive={formData.category === Category.Premium}
          isPopular
          title="Premium"
          description="Få tilgang til våre mest erfarne syere."
          price={500}
        />
      </div>
      <Button
        label="Fortsett"
        link="/"
        disabled={formData.category === Category.None}
      />
    </>
  );
};

export default OrderServicePage;
