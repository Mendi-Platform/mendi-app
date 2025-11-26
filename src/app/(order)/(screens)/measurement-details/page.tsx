"use client";

import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

const MeasurementDetailsPage = () => {
  const { formData, updateFormData } = useCart();
  const router = useRouter();

  const onMeasurementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        measurements: e.target.value,
        detailsText: `Mål: ${e.target.value}`,
      },
    });
  };

  const handleContinue = () => {
    router.push("/order/add-image");
  };

  if (formData.repairDetails?.measurementMethod !== "measurements") {
    router.push("/order/add-image");
    return null;
  }

  return (
    <>
      <h1 className="font-medium text-lg mb-3">Send mål</h1>
      <p className="text-sm text-[#797979] mb-6">
        Skriv inn målene du ønsker at plagget skal tilpasses til i centimeter.
      </p>
      <div className="mb-14">
        <textarea
          placeholder="For eksempel: Legg opp 5 cm"
          className="text-sm px-4 py-4 w-full h-32 border border-[#7A7A7A] rounded-[7.5px]"
          value={formData.repairDetails?.measurements || ""}
          onChange={onMeasurementsChange}
        />
      </div>
      <button
        type="button"
        onClick={handleContinue}
        disabled={!formData.repairDetails?.measurements}
        className="block w-full text-center py-2.5 rounded-[20px] bg-[#006EFF] text-white hover:opacity-70 text-xl font-semibold disabled:bg-white disabled:text-[#A7A7A7] disabled:border disabled:border-black/30"
      >
        Fortsett
      </button>
    </>
  );
};

export default MeasurementDetailsPage; 