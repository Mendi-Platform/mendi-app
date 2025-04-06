"use client"

import { useState } from "react";
import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";

enum ServiceChoices {
  Reparation,
  Adjustment
}

const OrderServicePage = () => {
  const [choice, setChoice] = useState<ServiceChoices>()
  return (
    <>
      <h1 className="font-medium text-lg mb-3">
            Hvilken tjeneste trenger du?
          </h1>
          <p className="mb-11 text-sm font-normal text-[#797979]">
            Velg ett alternativ. Hvis du trenger noe annet, kan du legge det til
            på et senere tidspunkt.
          </p>
          <div className="flex flex-col gap-3.5 mb-14">
            <ButtonOption onClick={() => setChoice(ServiceChoices.Reparation)} active={choice === ServiceChoices.Reparation} label="Reparasjon" />
            <ButtonOption onClick={() => setChoice(ServiceChoices.Adjustment)} active={choice === ServiceChoices.Adjustment} label="Tilpasning" />
          </div>          
          <Button label="Fortsett" link="/order/item"/>
    </>
  );
};

export default OrderServicePage;
