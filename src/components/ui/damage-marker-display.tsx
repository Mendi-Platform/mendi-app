"use client";

import Image from "next/image";
import { Garment, DamageMarkers } from "@/types/formData";
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

const garmentImages = {
  [Garment.UpperBody]: {
    front: frontTop,
    back: backTop,
  },
  [Garment.LowerBody]: {
    front: frontBottom,
    back: backBottom,
  },
  [Garment.Kjole]: {
    front: frontDress,
    back: backDress,
  },
  [Garment.Dress]: {
    front: frontSuit,
    back: backSuit,
  },
  [Garment.OuterWear]: {
    front: frontCoat,
    back: backCoat,
  },
};

interface DamageMarkerDisplayProps {
  garment: Garment;
  damageMarkers: DamageMarkers;
  size?: "small" | "medium" | "large";
}

const DamageMarkerDisplay = ({ 
  garment, 
  damageMarkers, 
  size = "small" 
}: DamageMarkerDisplayProps) => {
  const currentGarment = garmentImages[garment as keyof typeof garmentImages];
  
  if (!currentGarment || !damageMarkers) {
    return null;
  }

  const sizeClasses = {
    small: "w-20 h-24",
    medium: "w-32 h-40",
    large: "w-48 h-60"
  };

  const markerSizes = {
    small: "w-2 h-2",
    medium: "w-3 h-3", 
    large: "w-4 h-4"
  };

  const hasMarkers = damageMarkers.front.length > 0 || damageMarkers.back.length > 0;

  if (!hasMarkers) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-4">
        {damageMarkers.front.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-600">Foran</span>
            <div className={`relative ${sizeClasses[size]} bg-white rounded border border-gray-200`}>
              <Image
                src={currentGarment.front}
                alt="Foran"
                width={100}
                height={120}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                className="absolute inset-0"
              />
              {damageMarkers.front.map((marker, idx) => (
                <div
                  key={idx}
                  className={`absolute ${markerSizes[size]} rounded-full bg-red-500 border border-white`}
                  style={{
                    left: `calc(${marker.x}% - ${size === 'small' ? '4px' : size === 'medium' ? '6px' : '8px'})`,
                    top: `calc(${marker.y}% - ${size === 'small' ? '4px' : size === 'medium' ? '6px' : '8px'})`
                  }}
                />
              ))}
            </div>
          </div>
        )}
        
        {damageMarkers.back.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs text-gray-600">Bak</span>
            <div className={`relative ${sizeClasses[size]} bg-white rounded border border-gray-200`}>
              <Image
                src={currentGarment.back}
                alt="Bak"
                width={100}
                height={120}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                className="absolute inset-0"
              />
              {damageMarkers.back.map((marker, idx) => (
                <div
                  key={idx}
                  className={`absolute ${markerSizes[size]} rounded-full bg-red-500 border border-white`}
                  style={{
                    left: `calc(${marker.x}% - ${size === 'small' ? '4px' : size === 'medium' ? '6px' : '8px'})`,
                    top: `calc(${marker.y}% - ${size === 'small' ? '4px' : size === 'medium' ? '6px' : '8px'})`
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DamageMarkerDisplay; 