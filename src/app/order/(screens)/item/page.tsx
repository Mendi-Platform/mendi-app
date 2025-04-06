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

const itemList = [
  {
    label: "Bukse",
    value: ItemsChoices.Pants,
    logo: pants
  },
  {
    label: "Genser",
    value: ItemsChoices.Sweather,
    logo: sweater
  },
  {
    label: "Jakke",
    value: ItemsChoices.Jacket,
    logo: jacket
  },
  {
    label: "Kjole",
    value: ItemsChoices.Dress,
    logo: dress
  },
  {
    label: "Skjorte",
    value: ItemsChoices.Shirt,
    logo: shirt
  },
  {
    label: "Blazer",
    value: ItemsChoices.Blazer,
    logo: blazer
  },
  {
    label: "Skjørt",
    value: ItemsChoices.Skirt,
    logo: skirt
  },
  {
    label: "Jeans",
    value: ItemsChoices.Jeans,
    logo: jeans
  },
  {
    label: "Kåpe/Frakk",
    value: ItemsChoices.Frakk,
    logo: frakk
  },
];

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
        {itemList.map((item) => (
          <ButtonOption
            key={item.value}
            label={item.label}
            logo={item.logo}
            active={choice === item.value}
            onClick={() => setChoice(item.value)}
          />
        ))}
      </div>      
      <Button label="Fortsett" link="/order/reparation"/>
    </>
  );
};

export default OrderItemPage;
