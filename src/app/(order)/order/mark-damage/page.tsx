"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import frontTop from "@/app/assets/icons/mark-damage/front-top.svg";
import backTop from "@/app/assets/icons/mark-damage/back-top.svg";
import frontBottom from "@/app/assets/icons/mark-damage/front-bottom.svg";
import backBottom from "@/app/assets/icons/mark-damage/back-bottom.svg";
import frontDress from "@/app/assets/icons/mark-damage/front-dress.svg";
import backDress from "@/app/assets/icons/mark-damage/back-dress.svg";
import frontSuit from "@/app/assets/icons/mark-damage/front-suit.svg";
import backSuit from "@/app/assets/icons/mark-damage/back-suit.svg";
import frontCoat from "@/app/assets/icons/mark-damage/front-coat.svg";
import backCoat from "@/app/assets/icons/mark-damage/back-coat.svg";
import { LinkButton } from "@/components/ui/button";
import TabSwitcher from "@/components/ui/TabSwitcher";
import { useCart } from "@/contexts/CartContext";
import type { DamageMarkers, GarmentSlug } from "@/types/formData";
import { useRouter } from "next/navigation";

const garmentImages: Record<GarmentSlug, { front: string; back: string } | undefined> = {
  '': undefined,
  'upper-body': {
    front: frontTop,
    back: backTop,
  },
  'lower-body': {
    front: frontBottom,
    back: backBottom,
  },
  'kjole': {
    front: frontDress,
    back: backDress,
  },
  'dress': {
    front: frontSuit,
    back: backSuit,
  },
  'outer-wear': {
    front: frontCoat,
    back: backCoat,
  },
  'leather-items': undefined,
  'curtains': undefined,
};

const MarkDamagePage = () => {
  const { formData, updateFormData, isHydrated } = useCart();
  const router = useRouter();
  
  // Initialize markers from state or default
  const [markers, setMarkers] = useState<DamageMarkers>({ front: [], back: [] });
  const imgRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'front' | 'back'>('front');

  // Load markers from store when hydrated
  useEffect(() => {
    if (isHydrated && formData.repairDetails?.damageMarkers) {
      setMarkers(formData.repairDetails.damageMarkers);
    }
  }, [isHydrated, formData.repairDetails?.damageMarkers]);

  // Redirect logic - only after hydration
  useEffect(() => {
    if (isHydrated) {
      if (formData.garmentSlug === 'leather-items' || formData.garmentSlug === 'curtains') {
        router.replace('/order/additional-details');
      } else if (formData.garmentSlug === '') {
        router.replace('/order/garment');
      }
    }
  }, [formData.garmentSlug, router, isHydrated]);

  // Function to save markers to state
  const saveMarkersToState = (newMarkers: DamageMarkers) => {
    updateFormData({
      ...formData,
      repairDetails: {
        ...formData.repairDetails,
        damageMarkers: newMarkers,
      },
    });
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Sjekk om det finnes en markør nær klikkpunktet
    const existingMarkerIndex = markers[view].findIndex(
      marker => Math.abs(marker.x - x) < 5 && Math.abs(marker.y - y) < 5
    );

    let newMarkers: DamageMarkers;
    
    if (existingMarkerIndex !== -1) {
      // Fjern markøren hvis den finnes
      newMarkers = {
        ...markers,
        [view]: markers[view].filter((_, idx) => idx !== existingMarkerIndex)
      };
    } else {
      // Legg til ny markør
      newMarkers = {
        ...markers,
        [view]: [...markers[view], { x, y }]
      };
    }
    
    setMarkers(newMarkers);
    saveMarkersToState(newMarkers);
  };

  const clearMarkers = () => {
    const newMarkers = {
      ...markers,
      [view]: []
    };
    setMarkers(newMarkers);
    saveMarkersToState(newMarkers);
  };

  // Don't render until hydrated
  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center min-h-screen px-4 py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const hasMarkers = markers[view].length > 0;
  const currentGarment = garmentImages[formData.garmentSlug];

  // Hvis currentGarment er undefined, vis loading (redirect vil håndtere dette)
  if (!currentGarment) {
    return (
      <div className="flex flex-col items-center min-h-screen px-4 py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8">
      <h1 className="font-medium text-lg mb-2 text-left w-full max-w-xs">Marker skadede områder</h1>
      <p className="text-sm text-[#797979] mb-6 text-left w-full max-w-xs">Trykk på plagget for å markere hvor det er hull eller skade.</p>
      
      <TabSwitcher
        tabs={[
          { label: "Foran", value: "front" },
          { label: "Bak", value: "back" },
        ]}
        value={view}
        onChange={v => setView(v as 'front' | 'back')}
        className="mb-4 w-full max-w-xs"
      />

      <div className="w-full max-w-xs">
        <div
          ref={imgRef}
          className="relative w-full aspect-[3/4] bg-white rounded-lg overflow-hidden border border-gray-200"
          onClick={handleImageClick}
        >
          <Image
            src={currentGarment[view]}
            alt={`${formData.garmentSlug} ${view}`}
            width={200}
            height={300}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            className="absolute inset-0"
          />
          {markers[view].map((marker, idx) => (
            <div
              key={idx}
              className="absolute w-5 h-5 rounded-full bg-[#006EFF] border-2 border-white shadow"
              style={{
                left: `calc(${marker.x}% - 10px)`,
                top: `calc(${marker.y}% - 10px)`
              }}
            />
          ))}
        </div>
        <div className="flex justify-start mt-2">
          <button
            onClick={clearMarkers}
            className={`text-sm underline ${
              hasMarkers 
                ? "text-gray-800 hover:text-gray-900" 
                : "text-gray-400 cursor-default"
            }`}
            disabled={!hasMarkers}
          >
            Tøm markører
          </button>
        </div>
      </div>

      <LinkButton 
        label="Fortsett" 
        link="/order/add-image" 
        className="mt-6 w-full max-w-xs" 
      />
    </div>
  );
};

export default MarkDamagePage; 