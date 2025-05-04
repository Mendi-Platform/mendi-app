"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const options = [
  { label: "Falskt skinn", value: "faux" },
  { label: "Ekte skinn", value: "real" },
  { label: "Usikker", value: "unknown" },
];

export default function LeatherTypePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const isRealLeather = selected === "real";

  const handleContinue = () => {
    if (!isRealLeather && selected) {
      router.push("/order/service");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center gap-2 mb-11 mt-8">
        <h1 className="font-medium text-lg">Hvilken type skinn er det?</h1>
      </div>
      <div className="flex flex-col gap-4 mb-6">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelected(option.value)}
            className={`w-full rounded-xl py-3 px-4 text-left font-medium border transition-all
              ${selected === option.value ? "bg-[#E5EDFF] border-[#0066FF] text-[#0066FF]" : "bg-[#F6F6F6] border-transparent text-black"}
            `}
          >
            <span>{option.label}</span>
            {option.value === "faux" && selected === "faux" && (
              <div className="text-xs text-[#797979] font-normal mt-1">Imitert/vegansk skinn</div>
            )}
          </button>
        ))}
      </div>
      {isRealLeather && (
        <div className="text-sm text-[#797979] bg-[#F6F6F6] rounded-lg p-4 mb-6">
          Vi kan dessverre ikke jobbe med ekte skinn, da det krever spesialverktøy. Fint om du velger det som passer best, eller velger &quot;Usikker&quot; hvis du er i tvil.
        </div>
      )}
      <button
        onClick={handleContinue}
        disabled={!selected || isRealLeather}
        className={`mt-auto w-full rounded-lg border border-[#E5E5E5] py-3 font-medium text-[#797979] bg-white transition-all ${(!selected || isRealLeather) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#F6F6F6] cursor-pointer'}`}
      >
        Fortsett
      </button>
    </div>
  );
} 