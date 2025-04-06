"use client";

import { useState } from "react";
import Button from "../../(components)/button";
import CategoryCard from "./categoryCard";

enum Category {
  Premium,
  Standard,
}

const OrderServicePage = () => {
  const [choice, setChoice] = useState<Category>();

  return (
    <>
      <h1 className="font-medium text-lg mb-3">Velg etter dine behov:</h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        Velg alternativet som passer deg best.
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        <CategoryCard
          onClick={() => setChoice(Category.Standard)}
          isActive={choice === Category.Standard}
          title="Standard"
          description="Kvalitet til en god pris."
          price={300}
        />
        <CategoryCard
          onClick={() => setChoice(Category.Premium)}
          isActive={choice === Category.Premium}
          isPopular
          title="Premium"
          description="Få tilgang til våre mest erfarne syere."
          price={500}
        />
      </div>
      <Button label="Fortsett" link="/order/item" />
    </>
  );
};

export default OrderServicePage;
