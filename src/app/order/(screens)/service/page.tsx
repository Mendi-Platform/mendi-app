"use client";

import { useState } from "react";
import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";

enum ServiceChoices {
  Reparation,
  Adjustment,
}

const OrderServicePage = () => {
  const [choice, setChoice] = useState<ServiceChoices>();
  return (
    <>
      <h1 className="font-medium text-lg mb-3">Hvilken tjeneste trenger du?</h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        Velg ett alternativ. Hvis du trenger noe annet, kan du legge det til på
        et senere tidspunkt.
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        <ButtonOption
          onClick={() => setChoice(ServiceChoices.Reparation)}
          active={choice === ServiceChoices.Reparation}
          label="Reparasjon"
        />
        <ButtonOption
          onClick={() => setChoice(ServiceChoices.Adjustment)}
          active={choice === ServiceChoices.Adjustment}
          label="Tilpasning"
        />
      </div>
      {choice === ServiceChoices.Reparation && <p className="text-sm mb-14">
        <span className="font-semibold">Reparasjon</span> er å fikse skader, som å lappe en revne eller bytte ut en
        ødelagt glidelås, for å gjøre plagget ditt så godt som nytt.
      </p>}
      {choice === ServiceChoices.Adjustment && <p className="text-sm mb-14">
        <span className="font-semibold">Tilpasning</span> er å skreddersy passformen eller stilen på plagget ditt etter dine preferanser – som å forkorte lengden eller ta inn livet.
      </p>}
      <Button label="Fortsett" link="/order/item" />
    </>
  );
};

export default OrderServicePage;
