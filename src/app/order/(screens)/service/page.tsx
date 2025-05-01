"use client";

import Button from "../../(components)/button";
import ButtonOption from "../../(components)/buttonOption";
import { RepairType } from "@/types/formData";
import useFormDataStore from "@/store";

const repairList = [
  {
    label: "Bytte glidelås",
    value: RepairType.ReplaceZipper,
    nextPage: "/order/two-option",
  },
  {
    label: "Sy på ny knapp",
    value: RepairType.SewButton,
    nextPage: "/order/quantity",
  },
  {
    label: "Hull",
    value: RepairType.Hole,
    nextPage: "/order/two-option",
  },
  {
    label: "Fest på beltehemper",
    value: RepairType.BeltLoops,
    nextPage: "/order/quantity",
  },
  {
    label: "Legge opp",
    value: RepairType.Hemming,
    nextPage: "/order/two-option",
  },
  {
    label: "Ta inn i livet",
    value: RepairType.AdjustWaist,
    nextPage: "/order/two-option",
  },
  {
    label: "Annen forespørsel",
    value: RepairType.OtherRequest,
    nextPage: "/order/other-request",
  },
];

const ServicePage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const updateFormData = store.updateFormData;

  const onChoice = (value: RepairType) => {
    updateFormData({
      ...formData,
      repairType: value,
      repairDetails: {}, // Reset repair details when changing repair type
    });
  };

  const selectedRepair = repairList.find(
    (item) => item.value === formData.repairType
  );

  return (
    <>
      <h1 className="font-medium text-lg mb-11">
        Hvordan vil du at plagget skal repareres?
      </h1>
      <div className="flex flex-col gap-3.5 mb-14">
        {repairList.map((item) => (
          <ButtonOption
            key={item.value}
            label={item.label}
            active={formData.repairType === item.value}
            onClick={() => onChoice(item.value)}
          />
        ))}
      </div>
      <Button
        label="Fortsett"
        link={selectedRepair?.nextPage || "/order/material"}
        prefetch
        disabled={formData.repairType === RepairType.None}
      />
    </>
  );
};

export default ServicePage;