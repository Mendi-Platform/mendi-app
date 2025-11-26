"use client";

import type { RepairTypeSlug } from "@/types/formData";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AdditionalDetailsConfig {
  title: { nb: string; en: string };
  subtitle: { nb: string; en: string };
  placeholder: { nb: string; en: string };
}

const detailsConfigs: Record<RepairTypeSlug, AdditionalDetailsConfig> = {
  '': {
    title: { nb: '', en: '' },
    subtitle: { nb: '', en: '' },
    placeholder: { nb: '', en: '' },
  },
  'replace-zipper': {
    title: { nb: 'I hvilken farge er glidelåsen?', en: 'What color is the zipper?' },
    subtitle: { nb: '(valgfritt)', en: '(optional)' },
    placeholder: { nb: 'For eksempel: Sort glidelås som matcher plagget', en: 'For example: Black zipper that matches the garment' },
  },
  'sew-button': {
    title: { nb: 'Hvor er plassert knappen/knappene?', en: 'Where is the button/buttons located?' },
    subtitle: { nb: '(valgfritt)', en: '(optional)' },
    placeholder: { nb: 'For eksempel: Knapp nummer to fra toppen på skjorten', en: 'For example: Second button from the top on the shirt' },
  },
  'hole': {
    title: { nb: 'Hvor er plassert hullet/hullene?', en: 'Where is the hole/holes located?' },
    subtitle: { nb: '(valgfritt)', en: '(optional)' },
    placeholder: { nb: 'For eksempel: Hull på høyre kne', en: 'For example: Hole on right knee' },
  },
  'small-hole': {
    title: { nb: 'Hvor er plassert hullet/hullene?', en: 'Where is the hole/holes located?' },
    subtitle: { nb: '(valgfritt)', en: '(optional)' },
    placeholder: { nb: 'For eksempel: Hull på høyre kne', en: 'For example: Hole on right knee' },
  },
  'big-hole': {
    title: { nb: 'Hvor er plassert hullet/hullene?', en: 'Where is the hole/holes located?' },
    subtitle: { nb: '(valgfritt)', en: '(optional)' },
    placeholder: { nb: 'For eksempel: Hull på høyre kne', en: 'For example: Hole on right knee' },
  },
  'belt-loops': {
    title: { nb: 'Hvilket stoff skal beltehempen lages av?', en: 'What fabric should the belt loop be made of?' },
    subtitle: { nb: '(valgfritt)', en: '(optional)' },
    placeholder: { nb: 'For eksempel: Samme stoff som buksen, eller beskriv ønsket materiale', en: 'For example: Same fabric as the pants, or describe desired material' },
  },
  'hemming': {
    title: { nb: '', en: '' },
    subtitle: { nb: '', en: '' },
    placeholder: { nb: '', en: '' },
  },
  'adjust-waist': {
    title: { nb: '', en: '' },
    subtitle: { nb: '', en: '' },
    placeholder: { nb: '', en: '' },
  },
  'other-request': {
    title: { nb: 'Beskrivelse av oppdraget:', en: 'Description of the task:' },
    subtitle: { nb: 'Vennligst gi en så god beskrivelse som mulig av plagget og hvordan du ønsker at det skal repareres eller tilpasses.', en: 'Please provide as good a description as possible of the garment and how you want it repaired or adjusted.' },
    placeholder: { nb: 'For eksempel: Vennligst legg opp 5 cm.', en: 'For example: Please hem up 5 cm.' },
  },
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const AdditionalDetailsPage = () => {
  const { language } = useLanguage();
  const { formData, updateFormData } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  useEffect(() => {
    if (formData.repairTypeSlug === '') {
      router.replace('/order/service');
    }
  }, [formData.repairTypeSlug, router]);

  const config = detailsConfigs[formData.repairTypeSlug];

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
    if (formData.repairTypeSlug === 'other-request') {
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

  const isOtherRequest = formData.repairTypeSlug === 'other-request';
  const email = formData.repairDetails?.email || "";
  const emailValid = !isOtherRequest || (email && validateEmail(email));
  const city = formData.repairDetails?.city || "";

  // i18n labels
  const labels = {
    emailLabel: language === 'nb' ? 'Legg inn din e-post (vi kontakter deg her)' : 'Enter your email (we will contact you here)',
    emailPlaceholder: 'example@example.com',
    emailError: language === 'nb' ? 'Vennligst oppgi en gyldig e-postadresse' : 'Please provide a valid email address',
    cityLabel: language === 'nb' ? 'Hvilken by er du i?' : 'What city are you in?',
    cityPlaceholder: language === 'nb' ? 'F.eks. Oslo' : 'E.g. Oslo',
    submitOther: language === 'nb' ? 'Send inn forespørsel' : 'Submit request',
    continue: language === 'nb' ? 'Fortsett' : 'Continue',
  };

  return (
    <>
      <h1 className="font-medium text-lg mb-1">{config.title[language]}</h1>
      <p className="mb-6 text-sm font-normal text-[#797979]">{config.subtitle[language]}</p>
      <div className="mb-14">
        <textarea
          placeholder={config.placeholder[language]}
          className="text-sm px-4 py-4 w-full h-32 border border-[#7A7A7A] rounded-[7.5px] mb-4"
          value={formData.repairDetails?.additionalDetails || ''}
          onChange={onDetailsChange}
        ></textarea>
        {isOtherRequest && (
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-sm font-normal text-[#242424]">{labels.emailLabel}</span>
            <input
              type="email"
              required
              placeholder={labels.emailPlaceholder}
              className="text-sm px-4 py-3 w-full border border-[#7A7A7A] rounded-[7.5px] mb-1 placeholder-[#A7A7A7]"
              value={email}
              onChange={onEmailChange}
              onBlur={() => setEmailTouched(true)}
            />
            {emailTouched && !emailValid && (
              <span className="text-xs text-red-500">{labels.emailError}</span>
            )}
            <span className="text-sm font-normal text-[#242424] mt-3">{labels.cityLabel}</span>
            <input
              type="text"
              placeholder={labels.cityPlaceholder}
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
        {isOtherRequest ? labels.submitOther : labels.continue}
      </button>
    </>
  );
};

export default AdditionalDetailsPage;
