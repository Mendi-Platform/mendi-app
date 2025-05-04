"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import frontTop from "@/app/assets/icons/front-top.svg";
import backTop from "@/app/assets/icons/back-top.svg";
import Button from "@/components/ui/button";
import TabSwitcher from "@/components/ui/TabSwitcher";

const MarkDamagePage = () => {
  const [markers, setMarkers] = useState<{ front: { x: number; y: number }[]; back: { x: number; y: number }[] }>({ front: [], back: [] });
  const imgRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'front' | 'back'>('front');

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMarkers((prev) => ({
      ...prev,
      [view]: [...prev[view], { x, y }],
    }));
  };

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
      <div
        ref={imgRef}
        className="relative w-full max-w-xs aspect-[3/4] bg-white rounded-lg overflow-hidden border border-gray-200 mb-6"
        onClick={handleImageClick}
      >
        <Image
          src={view === 'front' ? frontTop : backTop}
          alt={view === 'front' ? 'Overdel foran' : 'Overdel bak'}
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
      <Button label="Fortsett" link="/order/add-image" className="mt-6 w-full max-w-xs" />
    </div>
  );
};

export default MarkDamagePage; 