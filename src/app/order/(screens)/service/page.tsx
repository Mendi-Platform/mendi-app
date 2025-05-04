"use client";

import ButtonOption from "@/components/ui/buttonOption";
import { RepairType, Garment } from "@/types/formData";
import useFormDataStore from "@/store";
import { useRouter } from "next/navigation";

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
    nextPage: "/order/other-request-info",
  },
];

const curtainRepairList = [
  {
    label: "Legge opp",
    value: RepairType.Hemming,
    nextPage: "/order/two-option",
  },
  {
    label: "Annen forespørsel",
    value: RepairType.OtherRequest,
    nextPage: "/order/other-request-info",
  },
];

const ServicePage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const router = useRouter();

  const onChoice = (value: RepairType) => {
    store.updateFormField("repairType", value);
  };

  const handleContinue = () => {
    const selectedOption = (formData.garment === Garment.Curtains ? curtainRepairList : repairList)
      .find(item => item.value === formData.repairType);
    if (selectedOption?.nextPage) {
      router.push(selectedOption.nextPage);
    }
  };

  return (
    <>
      <h1 className="font-medium text-lg mb-11">
        Hvordan vil du at plagget skal repareres?
      </h1>
      <div className="flex flex-col gap-3.5 mb-14">
        {(formData.garment === Garment.Curtains ? curtainRepairList : repairList).map((item) => (
          <ButtonOption
            key={item.value}
            label={item.label}
            active={formData.repairType === item.value}
            onClick={() => onChoice(item.value)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={handleContinue}
        disabled={formData.repairType === RepairType.None}
        className={`block w-full text-center py-2.5 rounded-[20px]  ${
          formData.repairType === RepairType.None
            ? "bg-white text-[#A7A7A7] border border-black/30 cursor-auto"
            : "bg-[#006EFF] text-white"
        } hover:opacity-70 text-xl font-semibold`}
      >
        Fortsett
      </button>
    </>
  );
};

export default ServicePage;