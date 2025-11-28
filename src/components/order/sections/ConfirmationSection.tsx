"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getOrderByStripeSessionId, type Order } from "@/lib/orders";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";

interface ConfirmationSectionProps {
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

// Helper to get repair type label
const getRepairTypeLabel = (slug: string, language: string): string => {
  const labels: Record<string, Record<string, string>> = {
    nb: {
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
    },
    en: {
      '': '',
      'replace-zipper': 'Replace zipper',
      'sew-button': 'Sew on button',
      'hole': 'Hole',
      'small-hole': 'Small hole',
      'big-hole': 'Big hole',
      'belt-loops': 'Fix belt loops',
      'hemming': 'Hemming',
      'adjust-waist': 'Adjust waist',
      'other-request': 'Other request',
    }
  };
  return labels[language]?.[slug] || labels['nb'][slug] || 'Repair';
};

// Helper to get garment label
const getGarmentLabel = (slug: string, language: string): string => {
  const labels: Record<string, Record<string, string>> = {
    nb: {
      '': '',
      'upper-body': 'Overdel',
      'lower-body': 'Underdel',
      'kjole': 'Kjole',
      'dress': 'Dress',
      'outer-wear': 'Jakke/Yttertøy',
      'leather-items': 'Skinnplagg',
      'curtains': 'Gardiner',
    },
    en: {
      '': '',
      'upper-body': 'Upper body',
      'lower-body': 'Lower body',
      'kjole': 'Dress',
      'dress': 'Suit',
      'outer-wear': 'Jacket/Outerwear',
      'leather-items': 'Leather items',
      'curtains': 'Curtains',
    }
  };
  return labels[language]?.[slug] || labels['nb'][slug] || '';
};

export default function ConfirmationSection({ orderFlowConfig: _orderFlowConfig }: ConfirmationSectionProps) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const { language } = useLanguage();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // i18n labels
  const labels = {
    loading: language === 'nb' ? 'Laster ordredetaljer...' : 'Loading order details...',
    errorTitle: language === 'nb' ? 'Noe gikk galt' : 'Something went wrong',
    backToHome: language === 'nb' ? 'Tilbake til hjemmesiden' : 'Back to home',
    thankYou: language === 'nb' ? 'Takk for din forespørsel!' : 'Thank you for your request!',
    requestReceived: language === 'nb'
      ? 'Vi har mottatt din forespørsel og vil se på den så snart som mulig. Du vil høre fra oss på e-post eller telefon når vi har vurdert oppdraget.'
      : 'We have received your request and will review it as soon as possible. You will hear from us by email or phone when we have evaluated the order.',
    paymentComplete: language === 'nb' ? 'Betaling fullført!' : 'Payment complete!',
    confirmationSent: language === 'nb'
      ? 'Takk for din bestilling. Vi har sendt en bekreftelse til din e-post.'
      : 'Thank you for your order. We have sent a confirmation to your email.',
    orderDetails: language === 'nb' ? 'Ordredetaljer' : 'Order details',
    orderId: language === 'nb' ? 'Ordre-ID' : 'Order ID',
    services: language === 'nb' ? 'Tjenester' : 'Services',
    shipping: language === 'nb' ? 'Frakt' : 'Shipping',
    total: 'Total',
    whatHappensNow: language === 'nb' ? 'Hva skjer nå?' : 'What happens now?',
    step1: language === 'nb' ? 'Vi kontakter deg for å avtale levering av plagget' : 'We will contact you to arrange garment delivery',
    step2: language === 'nb' ? 'Send inn plagget ditt' : 'Send in your garment',
    step3: language === 'nb' ? 'Våre syere reparerer plagget' : 'Our seamstresses repair the garment',
    step4: language === 'nb' ? 'Du får plagget tilbake i perfekt stand!' : 'You get your garment back in perfect condition!',
  };

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
        setError(language === 'nb' ? "Kunne ikke hente ordredetaljer" : "Could not fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId, clearCart, language]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006EFF] mb-4" />
        <p className="text-[#797979]">{labels.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-semibold mb-4 text-red-600">{labels.errorTitle}</h1>
        <p className="text-base text-[#797979] mb-8">{error}</p>
        <Link href="/" className="text-[#006EFF] underline">
          {labels.backToHome}
        </Link>
      </div>
    );
  }

  // Show simple confirmation if no session_id or order not found
  if (!sessionId || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-2xl font-semibold mb-4">{labels.thankYou}</h1>
        <p className="text-base text-[#797979] mb-8">
          {labels.requestReceived}
        </p>
        <div className="text-4xl mb-4">🎉</div>
        <a href="https://mendi.app/" className="text-[#006EFF] underline">
          {labels.backToHome}
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
          <h1 className="text-2xl font-semibold mb-2">{labels.paymentComplete}</h1>
          <p className="text-base text-[#797979]">
            {labels.confirmationSent}
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-[#F3F3F3] rounded-[18px] p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">{labels.orderDetails}</h2>

          {/* Order ID */}
          <div className="flex justify-between mb-4">
            <span className="text-[#797979] text-sm">{labels.orderId}</span>
            <span className="text-sm font-mono">{order.id.slice(0, 8)}...</span>
          </div>

          {/* Items */}
          <div className="border-t border-[#E5E5E5] pt-4">
            <h3 className="font-medium text-sm mb-3">{labels.services}</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span className="text-sm">
                  {getRepairTypeLabel(item.repairTypeSlug, language)}
                  {item.garmentSlug && ` - ${getGarmentLabel(item.garmentSlug, language)}`}
                </span>
                <span className="text-sm">{item.price || 0} kr</span>
              </div>
            ))}
          </div>

          {/* Shipping */}
          {order.shippingCost > 0 && (
            <div className="flex justify-between border-t border-[#E5E5E5] pt-4 mt-4">
              <span className="text-sm text-[#797979]">{labels.shipping}</span>
              <span className="text-sm">{order.shippingCost} kr</span>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between border-t border-[#E5E5E5] pt-4 mt-4">
            <span className="font-semibold">{labels.total}</span>
            <span className="font-semibold">{order.total} kr</span>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-[#E3EEFF] rounded-[18px] p-6 mb-6">
          <h2 className="font-semibold text-lg mb-3">{labels.whatHappensNow}</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-[#797979]">
            <li>{labels.step1}</li>
            <li>{labels.step2}</li>
            <li>{labels.step3}</li>
            <li>{labels.step4}</li>
          </ol>
        </div>

        {/* Back to Home */}
        <a
          href="https://mendi.app/"
          className="block w-full text-center py-3 rounded-[20px] bg-[#006EFF] text-white font-semibold hover:opacity-70"
        >
          {labels.backToHome}
        </a>
      </div>
    </div>
  );
}
