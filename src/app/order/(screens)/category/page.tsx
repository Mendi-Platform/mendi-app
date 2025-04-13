"use client";

import { useContext } from "react";
import Button from "../../(components)/button";
import CategoryCard from "./categoryCard";
import { Category, FormContext } from "@/provider/FormProvider";

const OrderServicePage = () => {
  const formContext = useContext(FormContext);

  const choice = formContext.formData.category;

  const onChoice = (value: Category) => {
    formContext.updateFormData({
      ...formContext.formData,
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
          formData={formContext.formData}
          onClick={() => onChoice(Category.Standard)}
          isActive={choice === Category.Standard}
          title="Standard"
          description="Kvalitet til en god pris."
          price={300}
        />
        <CategoryCard
          formData={formContext.formData}
          onClick={() => onChoice(Category.Premium)}
          isActive={choice === Category.Premium}
          isPopular
          title="Premium"
          description="Få tilgang til våre mest erfarne syere."
          price={500}
        />
      </div>
      <Button label="Fortsett" link="/" />
    </>
  );
};

export default OrderServicePage;
