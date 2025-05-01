"use client";

import Button from "../../(components)/button";
import { RepairType } from "@/types/formData";
import useFormDataStore from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface MeasurementConfig {
  title: string;
  subtitle: string;
  placeholder: string;
}

const measurementConfigs: Record<RepairType, MeasurementConfig> = {
  [RepairType.Hemming]: {
    title: "Hvor mange centimeter ønsker du å endre?",
    subtitle: "Legg gjerne til mer informasjon om tilpasningen.",
    placeholder: "For eksempel: Vennligst legg opp 5 cm. Min innvendige benlengde er 84 cm.",
  },
  [RepairType.AdjustWaist]: {
    title: "Hvor mange centimeter ønsker du å endre?",
    subtitle: "Legg gjerne til mer informasjon om tilpasningen.",
    placeholder: "For eksempel: Vennligst ta inn 3 cm i livet.",
  },
  [RepairType.ReplaceZipper]: {
    title: "Hvor er glidelåsen plassert?",
    subtitle: "Beskriv hvor på plagget glidelåsen er.",
    placeholder: "For eksempel: Glidelåsen er i front av jakken.",
  },
  [RepairType.SewButton]: {
    title: "Hvor er knappen/knappene plassert?",
    subtitle: "Beskriv hvor på plagget knappen skal sys på.",
    placeholder: "For eksempel: Mangler knapp nummer to fra toppen på skjorten.",
  },
  [RepairType.Hole]: {
    title: "Hvor er hullet/hullene?",
    subtitle: "Beskriv hvor på plagget hullet er.",
    placeholder: "For eksempel: Hull på høyre kne.",
  },
  [RepairType.SmallHole]: {
    title: "Hvor er hullet/hullene?",
    subtitle: "Beskriv hvor på plagget hullet er.",
    placeholder: "For eksempel: Hull på høyre kne.",
  },
  [RepairType.BigHole]: {
    title: "Hvor er hullet/hullene?",
    subtitle: "Beskriv hvor på plagget hullet er.",
    placeholder: "For eksempel: Hull på høyre kne.",
  },
  [RepairType.BeltLoops]: {
    title: "Hvor er beltehempen?",
    subtitle: "Beskriv hvilken beltehempe som skal repareres.",
    placeholder: "For eksempel: Beltehempe bak til høyre har løsnet.",
  },
  [RepairType.OtherRequest]: {
    title: "Beskriv reparasjonen",
    subtitle: "Fortell oss hva du ønsker å få reparert.",
    placeholder: "Beskriv hva som skal repareres og hvor på plagget.",
  },
  [RepairType.None]: {
    title: "",
    subtitle: "",
    placeholder: "",
  },
};

const MeasurementDetailsPage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const updateFormData = store.updateFormData;
  const router = useRouter();

  useEffect(() => {
    if (formData.repairType === RepairType.None) {
      router.replace('/order/service');
    }
  }, [formData.repairType, router]);

  const config = measurementConfigs[formData.repairType];

  const onMeasurementChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        measurements: e.target.value,
      },
    });
  };

  if (!config) return null;

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
          onChange={onMeasurementChange}
        ></textarea>
      </div>
      <Button
        label="Fortsett"
        link="/order/material"
        prefetch
        disabled={!formData.repairDetails?.measurements}
      />
    </>
  );
};

export default MeasurementDetailsPage; 