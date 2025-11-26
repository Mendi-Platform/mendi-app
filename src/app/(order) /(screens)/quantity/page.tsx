"use client";

import { RepairType } from "@/types/formData";
import useFormDataStore from "@/store";
import { useRouter } from "next/navigation";

interface QuantityConfig {
  title: string;
  pricePerUnit: number;
}

const quantityConfigs: Partial<Record<RepairType, QuantityConfig>> = {
  [RepairType.SewButton]: {
    title: "Hvor mange knapper skal sys på?",
    pricePerUnit: 99,
  },
  [RepairType.BeltLoops]: {
    title: "Hvor mange beltehemper skal festes?",
    pricePerUnit: 0,
  },
};

const QuantityPage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const updateFormData = store.updateFormData;
  const router = useRouter();

  const config = quantityConfigs[formData.repairType];
  const quantity = formData.repairDetails?.quantity || 1;

  const getBeltLoopPrice = (qty: number) => {
    if (qty <= 2) return 199;
    if (qty <= 5) return 399;
    return 399;
  };

  const getPrice = (qty: number) => {
    if (formData.repairType === RepairType.BeltLoops) {
      return getBeltLoopPrice(qty);
    }
    return qty * (config?.pricePerUnit || 0);
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (formData.repairType === RepairType.BeltLoops && newQuantity > 5) return;
    let detailsText = '';
    if (formData.repairType === RepairType.SewButton) {
      detailsText = `Antall knapper: ${newQuantity}`;
    } else if (formData.repairType === RepairType.BeltLoops) {
      detailsText = `Antall beltehemper: ${newQuantity}`;
    }
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        quantity: newQuantity,
        detailsText,
      },
    });
  };

  const handleContinue = () => {
    updateFormData({
      ...formData,
      price: getPrice(quantity),
    });
    router.push("/order/add-image");
  };

  if (!config) return null;

  return (
    <>
      <h1 className="font-medium text-lg mb-11">{config.title}</h1>
      <div className="flex justify-center items-center gap-4 mb-14">
        <button
          onClick={() => updateQuantity(quantity - 1)}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
            quantity > 1
              ? "bg-[#006EFF] text-white"
              : "bg-[#FAFAFA] border border-[#7A7A7A] border-opacity-[0.34]"
          }`}
        >
          -
        </button>
        <span className="text-2xl">{quantity}</span>
        <button
          onClick={() => updateQuantity(quantity + 1)}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
            (formData.repairType === RepairType.BeltLoops && quantity >= 5)
              ? "bg-[#FAFAFA] border border-[#7A7A7A] border-opacity-[0.34]"
              : "bg-[#006EFF] text-white"
          }`}
        >
          +
        </button>
      </div>
      <div className="bg-[#E3EEFF] rounded-lg py-2 px-6 mb-14 flex flex-col items-center">
        <span className="text-2xl">{getPrice(quantity)} kr</span>
        <span className="text-sm text-[#797979]">
          {formData.repairType === RepairType.BeltLoops
            ? quantity <= 2
              ? "Opptil 2 beltehemper"
              : "Opptil 5 beltehemper"
            : `Opptil ${quantity} knapper`}
        </span>
      </div>
      <button
        className="block w-full text-center py-2.5 rounded-[20px] bg-[#006EFF] text-white hover:opacity-70 text-xl font-semibold disabled:bg-white disabled:text-[#A7A7A7] disabled:border disabled:border-black/30"
        onClick={handleContinue}
        disabled={!formData.repairDetails?.quantity}
      >
        Fortsett
      </button>
    </>
  );
};

export default QuantityPage; 