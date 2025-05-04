"use client";

import { RepairType } from "@/types/formData";
import useFormDataStore from "@/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  [RepairType.SmallHole]: {
    title: "Hvor er plassert hullet/hullene?",
    subtitle: "(valgfritt)",
    placeholder: "For eksempel: Hull på høyre kne",
  },
  [RepairType.BigHole]: {
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
    title: "Beskrivelse av oppdraget:",
    subtitle: "Vennligst gi en så god beskrivelse som mulig av plagget og hvordan du ønsker at det skal repareres eller tilpasses.",
    placeholder: "For eksempel: Vennligst legg opp 5 cm.",
  },
  [RepairType.None]: {
    title: "",
    subtitle: "",
    placeholder: "",
  },
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const AdditionalDetailsPage = () => {
  const store = useFormDataStore();
  const formData = store.formData;
  const updateFormData = store.updateFormData;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  useEffect(() => {
    if (formData.repairType === RepairType.None) {
      router.replace('/order/service');
    }
  }, [formData.repairType, router]);

  const config = detailsConfigs[formData.repairType];

  const onDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        additionalDetails: e.target.value,
      },
    });
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailTouched(true);
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        email: e.target.value,
      },
    });
  };

  const onCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        city: e.target.value,
      },
    });
  };

  const handleSubmit = async () => {
    if (formData.repairType === RepairType.OtherRequest) {
      setIsSubmitting(true);
      await fetch("/api/send-support-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          details: formData.repairDetails?.additionalDetails,
          email: formData.repairDetails?.email,
          city: formData.repairDetails?.city,
        }),
      });
      setIsSubmitting(false);
      router.push("/order/confirmation");
    } else {
      router.push("/order/measurement-details");
    }
  };

  if (!config) return null;

  const isOtherRequest = formData.repairType === RepairType.OtherRequest;
  const email = formData.repairDetails?.email || "";
  const emailValid = !isOtherRequest || (email && validateEmail(email));
  const city = formData.repairDetails?.city || "";

  return (
    <>
      <h1 className="font-medium text-lg mb-1">{config.title}</h1>
      <p className="mb-6 text-sm font-normal text-[#797979]">{config.subtitle}</p>
      <div className="mb-14">
        <textarea
          placeholder={config.placeholder}
          className="text-sm px-4 py-4 w-full h-32 border border-[#7A7A7A] rounded-[7.5px] mb-4"
          value={formData.repairDetails?.additionalDetails || ''}
          onChange={onDetailsChange}
        ></textarea>
        {isOtherRequest && (
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-sm font-normal text-[#242424]">Legg inn din e-post (vi kontakter deg her)</span>
            <input
              type="email"
              required
              placeholder="example@example.com"
              className="text-sm px-4 py-3 w-full border border-[#7A7A7A] rounded-[7.5px] mb-1 placeholder-[#A7A7A7]"
              value={email}
              onChange={onEmailChange}
              onBlur={() => setEmailTouched(true)}
            />
            {emailTouched && !emailValid && (
              <span className="text-xs text-red-500">Vennligst oppgi en gyldig e-postadresse</span>
            )}
            <span className="text-sm font-normal text-[#242424] mt-3">Hvilken by er du i?</span>
            <input
              type="text"
              placeholder="F.eks. Oslo"
              className="text-sm px-4 py-3 w-full border border-[#7A7A7A] rounded-[7.5px] placeholder-[#A7A7A7]"
              value={city}
              onChange={onCityChange}
            />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || !emailValid}
        className={`block w-full text-center py-2.5 rounded-[20px]  ${
          isSubmitting || !emailValid
            ? "bg-white text-[#A7A7A7] border border-black/30 cursor-auto"
            : "bg-[#006EFF] text-white"
        } hover:opacity-70 text-xl font-semibold`}
      >
        {isOtherRequest ? "Send inn forespørsel" : "Fortsett"}
      </button>
    </>
  );
};

export default AdditionalDetailsPage; 