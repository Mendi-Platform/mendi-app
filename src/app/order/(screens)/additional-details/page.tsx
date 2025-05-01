"use client";

import Button from "../../(components)/button";
import { RepairType } from "@/types/formData";
import useFormDataStore from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdditionalDetailsConfig {
  title: string;
  subtitle: string;
  placeholder: string;
}

const detailsConfigs: Record<RepairType, AdditionalDetailsConfig> = {
  [RepairType.ReplaceZipper]: {
    title: "I hvilken farge er glidelåsen?",
    subtitle: "(valgfritt)",
    placeholder: "For eksempel: Sort glidelås som matcher plagget",
  },
  [RepairType.SewButton]: {
    title: "Hvor er plassert knappen/knappene?",
    subtitle: "(valgfritt)",
    placeholder: "For eksempel: Knapp nummer to fra toppen på skjorten",
  },
  [RepairType.Hole]: {
    title: "Hvor er plassert hullet/hullene?",
    subtitle: "(valgfritt)",
    placeholder: "For eksempel: Hull på høyre kne",
  },
  [RepairType.BeltLoops]: {
    title: "Hvilket stoff skal beltehempen lages av?",
    subtitle: "(valgfritt)",
    placeholder: "For eksempel: Samme stoff som buksen, eller beskriv ønsket materiale",
  },
  [RepairType.Hemming]: {
    title: "",
    subtitle: "",
    placeholder: "",
  },
  [RepairType.AdjustWaist]: {
    title: "",
    subtitle: "",
    placeholder: "",
  },
  [RepairType.OtherRequest]: {
    title: "",
    subtitle: "",
    placeholder: "",
  },
  [RepairType.None]: {
    title: "",
    subtitle: "",
    placeholder: "",
  },
};

const AdditionalDetailsPage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const updateFormData = store.updateFormData;
  const router = useRouter();

  useEffect(() => {
    // Redirect if repair type is not one that needs additional details
    if (
      formData.repairType === RepairType.None ||
      formData.repairType === RepairType.Hemming ||
      formData.repairType === RepairType.AdjustWaist ||
      formData.repairType === RepairType.OtherRequest
    ) {
      router.replace('/order/service');
    }
  }, [formData.repairType, router]);

  const config = detailsConfigs[formData.repairType];

  const onDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        measurements: e.target.value,
      },
    });
  };

  if (!config?.title) return null;

  return (
    <>
      <h1 className="font-medium text-lg mb-3">
        {config.title}
      </h1>
      <p className="mb-11 text-sm font-normal text-[#797979]">
        {config.subtitle}
      </p>
      <div className="mb-14">
        <textarea
          placeholder={config.placeholder}
          className="text-sm px-4 py-4 w-full h-32 border border-[#7A7A7A] rounded-[7.5px]"
          value={formData.repairDetails?.measurements || ''}
          onChange={onDetailsChange}
        ></textarea>
      </div>
      <Button
        label="Fortsett"
        link="/order/add-image"
        prefetch
        disabled={false} // Optional field, so continue button is always enabled
      />
    </>
  );
};

export default AdditionalDetailsPage; 