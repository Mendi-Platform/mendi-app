"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Simuler sjekk av brukerens adresse
    // I fremtiden kan dette være en API-kall til backend
    const checkUserAddress = async () => {
      try {
        // Placeholder for adresse-sjekk
        // const userProfile = await fetch('/api/user/profile');
        // const userData = await userProfile.json();
        
        // For nå, simuler at brukeren ikke har adresse
        const hasAddress = false; // Dette vil komme fra API
        
        if (!hasAddress) {
          // Hvis ingen adresse, send til delivery form
          router.push("/order/checkout/delivery");
        } else {
          // Hvis adresse finnes, gå til neste steg (payment, confirmation, etc.)
          router.push("/order/checkout/payment"); // eller neste steg
        }
      } catch (error) {
        console.error("Error checking user address:", error);
        // Ved feil, send til delivery form som fallback
        router.push("/order/checkout/delivery");
      }
    };

    checkUserAddress();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006EFF] mx-auto mb-4"></div>
        <p className="text-[#797979]">Forbereder checkout...</p>
      </div>
    </div>
  );
};

export default CheckoutPage; 