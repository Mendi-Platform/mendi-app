"use client";

import Image from "next/image";
import type { GarmentSlug, DamageMarkers } from "@/types/formData";
import { useEffect, useState } from "react";

interface DamageMarkerDisplayProps {
  garmentSlug: GarmentSlug;
  damageMarkers: DamageMarkers;
  size?: "small" | "medium" | "large";
}

interface GarmentImages {
  front?: string;
  back?: string;
}

const DamageMarkerDisplay = ({
  garmentSlug,
  damageMarkers,
  size = "small"
}: DamageMarkerDisplayProps) => {
  const [garmentImages, setGarmentImages] = useState<GarmentImages>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGarmentImages = async () => {
      if (!garmentSlug) return;

      try {
        const response = await fetch('/api/garments');
        const garments = await response.json();
        const garment = garments.find((g: { slug: { current: string } }) => g.slug.current === garmentSlug);

        if (garment) {
          setGarmentImages({
            front: garment.damageMarkerFront,
            back: garment.damageMarkerBack
          });
        }
      } catch (error) {
        console.error('Failed to fetch garment images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGarmentImages();
  }, [garmentSlug]);

  if (loading || !garmentImages.front || !garmentImages.back || !damageMarkers) {
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
                src={garmentImages.front!}
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
                src={garmentImages.back!}
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