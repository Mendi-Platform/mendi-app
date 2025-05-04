"use client";

import Button from "@/components/ui/button";


const OtherRequestInfoPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="font-medium text-lg mb-4">Fant du ikke det du trenger?</h1>
      <p className="mb-10 text-sm font-normal text-[#797979] text-center max-w-md">
        Her kan du legge inn en spesiell forespørsel, så skal vi prøve å finne en syer som tar utfordringen. Vennligst gi en så god beskrivelse som mulig av plagget og hvordan du ønsker at det skal repareres eller tilpasses.
      </p>
      <Button
        label="Fortsett"
        link= "/order/additional-details"
        prefetch
      />
    </div>
  );
};

export default OtherRequestInfoPage; 