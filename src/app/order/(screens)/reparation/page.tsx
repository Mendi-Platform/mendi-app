"use client";

import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";
import { Fragment, useState } from "react";
import Incrementer from "../../(components)/incrementer";

enum ItemsChoices {
  ReplaceLock,
  BigHole,
  SmallHole,
  NewButton,
  BeltHole,
}

const repairList = [
  {
    label: "Bytte glidelås",
    value: ItemsChoices.ReplaceLock,
    emphasizedDescription: "Er glidelåsen din gåen?",
    description: "Vi fjerner den gamle, velger en ny og syr den på plass.",
  },
  {
    label: "Stort hull",
    canIncrement: true,
    value: ItemsChoices.BigHole,
    emphasizedDescription: "Hull i favoritten?",
    description:
      "Vær obs på at reparasjonen kan bli synlig hvis hullet er på et godt synlig sted eller hvis syeren ikke har en tråd som matcher helt. ",
  },
  {
    label: "Lite hull",
    canIncrement: true,
    value: ItemsChoices.SmallHole,
    emphasizedDescription: "Hull i favoritten?",
    description:
      "Vær obs på at reparasjonen kan bli synlig hvis hullet er på et godt synlig sted eller hvis syeren ikke har en tråd som matcher helt. ",
  },
  {
    label: "Sy på ny knapp",
    canIncrement: true,
    value: ItemsChoices.NewButton,
    emphasizedDescription: "Har knappen løsnet eller falt av?",
    description:
      "Vi fester den raskt igjen. Send gjerne med en lignende knapp (det er ofte en ekstra på vaskelappen) for best mulig match. ",
  },
  {
    label: "Fest på beltehemper",
    canIncrement: true,
    value: ItemsChoices.BeltHole,
    emphasizedDescription: "Har beltehempene røket?",
    description:
      "Har beltehempene røket? Vi syr dem på igjen og fikser eventuelle hull. Pris per beltehempe som skal repareres.",
  },
];

const OrderItemPage = () => {
  const [choice, setChoice] = useState<ItemsChoices>();
  return (
    <>
      <h1 className="font-medium text-lg mb-3">
        Hvordan vil du at plagget skal repareres?
      </h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        Velg en tjeneste. Du kan legge til en annen tjeneste senere.
      </p>
      <div className="flex flex-col gap-3.5 mb-14">
        {repairList.map((repair) => (
          <Fragment key={repair.value}>
            <ButtonOption
              label={repair.label}
              active={choice === repair.value}
              onClick={() => setChoice(repair.value)}
            />
            {repair.canIncrement && choice === repair.value && (
              <div className="flex justify-center">
                <Incrementer key={`${repair.value}-incrementer`} />
              </div>
            )}
          </Fragment>
        ))}
      </div>
      {choice !== undefined && (
        <p className="text-sm mb-14">
          <span className="font-semibold">
            {
              repairList.find((repair) => repair.value === choice)
                ?.emphasizedDescription
            }
          </span>{" "}
          {repairList.find((repair) => repair.value === choice)?.description}
        </p>
      )}
      <Button label="Fortsett" link="/order/item-type" />
    </>
  );
};

export default OrderItemPage;
