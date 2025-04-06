"use client";

import { useState } from "react";
import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";

enum ServiceChoices {
  Reparation,
  Adjustment,
}

const optionList = [
  {
    label: "Reparasjon",
    value: ServiceChoices.Reparation,
    description:
      "Reparasjon er å fikse skader, som å lappe en revne eller bytte ut en ødelagt glidelås, for å gjøre plagget ditt så godt som nytt.",
    link: "/order/reparation",
  },
  {
    label: "Tilpasning",
    value: ServiceChoices.Adjustment,
    description:
      "Tilpasning er å skreddersy passformen eller stilen på plagget ditt etter dine preferanser – som å forkorte lengden eller ta inn livet.",
  },
];

const OrderServicePage = () => {
  const [choice, setChoice] = useState<ServiceChoices>();

  const onChoice = (value: ServiceChoices) => {
    setChoice(value)
    sessionStorage.setItem("service", value.toString());
  }
  return (
    <>
      <h1 className="font-medium text-lg mb-3">Hvilken tjeneste trenger du?</h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        Velg ett alternativ. Hvis du trenger noe annet, kan du legge det til på
        et senere tidspunkt.
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        {optionList.map((option) => (
          <ButtonOption
            key={option.value}
            onClick={() => onChoice(option.value)}
            active={choice === option.value}
            label={option.label}
          />
        ))}
      </div>
      {choice !== undefined && (
        <p className="text-sm mb-14">
          <span className="font-semibold">
            {optionList.find((opt) => opt.value === choice)?.label}
          </span>{" "}
          {optionList.find((opt) => opt.value === choice)?.description}
        </p>
      )}
      <Button label="Fortsett" link="/order/item" />
    </>
  );
};

export default OrderServicePage;
