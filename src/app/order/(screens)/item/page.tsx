"use client"

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
import { useState } from "react";

enum ItemsChoices {
  Pants,
  Sweather,
  Jacket,
  Dress,
  Shirt,
  Blazer,
  Skirt,
  Jeans,
  Frakk,
}

const OrderItemPage = () => {
  const [choice, setChoice] = useState<ItemsChoices>()
  return (
    <>
      <h1 className="font-medium text-lg mb-3">
        Hvilket plagg ønsker du å reparere
      </h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        Velg ett plagg. Du kan legge til et annet plagg senere.
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        <ButtonOption label="Bukse" logo={pants} active={choice === ItemsChoices.Pants} onClick={() => setChoice(ItemsChoices.Pants)} />
        <ButtonOption label="Genser" logo={sweater} active={choice === ItemsChoices.Sweather} onClick={() => setChoice(ItemsChoices.Sweather)} />
        <ButtonOption label="Jakke" logo={jacket} active={choice === ItemsChoices.Jacket} onClick={() => setChoice(ItemsChoices.Jacket)} />
        <ButtonOption label="Kjole" logo={dress} active={choice === ItemsChoices.Dress} onClick={() => setChoice(ItemsChoices.Dress)} />
        <ButtonOption label="Skjorte" logo={shirt} active={choice === ItemsChoices.Shirt} onClick={() => setChoice(ItemsChoices.Shirt)} />
        <ButtonOption label="Blazer" logo={blazer} active={choice === ItemsChoices.Blazer} onClick={() => setChoice(ItemsChoices.Blazer)} />
        <ButtonOption label="Skjørt" logo={skirt} active={choice === ItemsChoices.Skirt} onClick={() => setChoice(ItemsChoices.Skirt)} />
        <ButtonOption label="Jeans" logo={jeans} active={choice === ItemsChoices.Jeans} onClick={() => setChoice(ItemsChoices.Jeans)} />
        <ButtonOption label="Kåpe/Frakk" logo={frakk} active={choice === ItemsChoices.Frakk} onClick={() => setChoice(ItemsChoices.Frakk)} />
      </div>
      <Button label="Fortsett" link="/order/reparation"/>
    </>
  );
};

export default OrderItemPage;
