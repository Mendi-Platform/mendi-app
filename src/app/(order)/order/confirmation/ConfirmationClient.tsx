"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getOrderByStripeSessionId, type Order } from "@/lib/orders";
import { useCart } from "@/contexts/CartContext";

// Helper to get repair type label
const getRepairTypeLabel = (slug: string): string => {
  const labels: Record<string, string> = {
    '': '',
    'replace-zipper': 'Bytte glidelås',
    'sew-button': 'Sy på ny knapp',
    'hole': 'Hull',
    'small-hole': 'Lite hull',
    'big-hole': 'Stort hull',
    'belt-loops': 'Fest på beltehemper',
    'hemming': 'Legge opp',
    'adjust-waist': 'Ta inn i livet',
    'other-request': 'Annen forespørsel',
  };
  return labels[slug] || 'Reparasjon';
};

// Helper to get garment label
const getGarmentLabel = (slug: string): string => {
  const labels: Record<string, string> = {
    '': '',
    'upper-body': 'Overdel',
    'lower-body': 'Underdel',
    'kjole': 'Kjole',
    'dress': 'Dress',
    'outer-wear': 'Jakke/Yttertøy',
    'leather-items': 'Skinnplagg',
    'curtains': 'Gardiner',
  };
  return labels[slug] || '';
};

export default function ConfirmationClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const orderData = await getOrderByStripeSessionId(sessionId);
        if (orderData) {
          setOrder(orderData);
          // Clear cart after successful payment
          clearCart();
          // Clear delivery state from localStorage
          localStorage.removeItem('deliveryState');
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Kunne ikke hente ordredetaljer");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId, clearCart]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006EFF] mb-4" />
        <p className="text-[#797979]">Laster ordredetaljer...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-semibold mb-4 text-red-600">Noe gikk galt</h1>
        <p className="text-base text-[#797979] mb-8">{error}</p>
        <Link href="/" className="text-[#006EFF] underline">
          Tilbake til hjemmesiden
        </Link>
      </div>
    );
  }

  // Show simple confirmation if no session_id or order not found
  if (!sessionId || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-semibold mb-4">Takk for din forespørsel!</h1>
        <p className="text-base text-[#797979] mb-8">
          Vi har mottatt din forespørsel og vil se på den så snart som mulig.
          Du vil høre fra oss på e-post eller telefon når vi har vurdert
          oppdraget.
        </p>
        <div className="text-4xl mb-4">🎉</div>
        <a href="https://mendi.app/" className="text-[#006EFF] underline">
          Tilbake til hjemmesiden
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[60vh] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✓</div>
          <h1 className="text-2xl font-semibold mb-2">Betaling fullført!</h1>
          <p className="text-base text-[#797979]">
            Takk for din bestilling. Vi har sendt en bekreftelse til din e-post.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-[#F3F3F3] rounded-[18px] p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Ordredetaljer</h2>

          {/* Order ID */}
          <div className="flex justify-between mb-4">
            <span className="text-[#797979] text-sm">Ordre-ID</span>
            <span className="text-sm font-mono">{order.id.slice(0, 8)}...</span>
          </div>

          {/* Items */}
          <div className="border-t border-[#E5E5E5] pt-4">
            <h3 className="font-medium text-sm mb-3">Tjenester</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span className="text-sm">
                  {getRepairTypeLabel(item.repairTypeSlug)}
                  {item.garmentSlug && ` - ${getGarmentLabel(item.garmentSlug)}`}
                </span>
                <span className="text-sm">{item.price || 0} kr</span>
              </div>
            ))}
          </div>

          {/* Shipping */}
          {order.shippingCost > 0 && (
            <div className="flex justify-between border-t border-[#E5E5E5] pt-4 mt-4">
              <span className="text-sm text-[#797979]">Frakt</span>
              <span className="text-sm">{order.shippingCost} kr</span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between border-t border-[#E5E5E5] pt-4 mt-4">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">{order.total} kr</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-[#E3EEFF] rounded-[18px] p-6 mb-6">
          <h2 className="font-semibold text-lg mb-3">Hva skjer nå?</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-[#797979]">
            <li>Vi kontakter deg for å avtale levering av plagget</li>
            <li>Send inn plagget ditt</li>
            <li>Våre syere reparerer plagget</li>
            <li>Du får plagget tilbake i perfekt stand!</li>
          </ol>
        </div>

        {/* Back to Home */}
        <a
          href="https://mendi.app/"
          className="block w-full text-center py-3 rounded-[20px] bg-[#006EFF] text-white font-semibold hover:opacity-70"
        >
          Tilbake til hjemmesiden
        </a>
      </div>
    </div>
  );
}
