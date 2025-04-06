"use client"

import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";
import { useState } from "react";

enum ItemsChoices {
  Normal,
  FalsktSkinn,
  Silke,
  Tjukke
}
const OrderItemPage = () => {
  const [choice, setChoice] = useState<ItemsChoices>()
  return (
    <>
      <h1 className="font-medium text-lg mb-3">
      Hva beskriver plagget ditt best?
      </h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
      Velg ett alternativ. Noen materialer krever premium service.
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        <ButtonOption label="Normale tekstiler" active={choice === ItemsChoices.Normal} onClick={() => setChoice(ItemsChoices.Normal)}/>
        <ButtonOption label="Falskt skinn" active={choice === ItemsChoices.FalsktSkinn} onClick={() => setChoice(ItemsChoices.FalsktSkinn)}/>
        <ButtonOption label="Silke eller delikate tekstiler" active={choice === ItemsChoices.Silke} onClick={() => setChoice(ItemsChoices.Silke)}/>
        <ButtonOption label="Tjukke tekstiler" active={choice === ItemsChoices.Tjukke} onClick={() => setChoice(ItemsChoices.Tjukke)}/>        
      </div>
      <Button label="Fortsett" link="/"/>
    </>
  );
};

export default OrderItemPage;