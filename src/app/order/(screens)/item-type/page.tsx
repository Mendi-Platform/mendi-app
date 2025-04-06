import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";
import { useState } from "react";

enum ItemsChoices {
  ReplaceLock,
  BigHole,
  SmallHole,
  NewButton,
  BeltHole
}

const OrderItemTypePage = () => {
  const [choice, setChoice] = useState<ItemsChoices>()
  return (
    <>
      <h1 className="font-medium text-lg mb-3">
      Hvordan vil du at plagget skal repareres?
      </h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
      Velg en tjeneste. Du kan legge til en annen tjeneste senere.
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        <ButtonOption label="Bytte glidelås" active={choice === ItemsChoices.ReplaceLock} onClick={() => setChoice(ItemsChoices.ReplaceLock)} />
        <ButtonOption label="Stort hull" active={choice === ItemsChoices.BigHole} onClick={() => setChoice(ItemsChoices.BigHole)}/>
        <ButtonOption label="Lite hull" active={choice === ItemsChoices.SmallHole} onClick={() => setChoice(ItemsChoices.SmallHole)}/>
        <ButtonOption label="Sy på ny knapp" active={choice === ItemsChoices.NewButton} onClick={() => setChoice(ItemsChoices.NewButton)}/>
        <ButtonOption label="Fest på beltehemper" active={choice === ItemsChoices.BeltHole} onClick={() => setChoice(ItemsChoices.BeltHole)}/>        
      </div>
      <Button label="Fortsett" link="/"/>
    </>
  );
};

export default OrderItemTypePage;
