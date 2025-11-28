"use client";

import PaymentPageClient from "@/app/(order)/order/payment/PaymentPageClient";
import type {
  SanityStoreLocation,
  SanityPostenOption,
  SanityDeliveryOption,
  SanityPricing,
  SanitySiteSettings,
  SanityGarment,
  OrderFlowStepExpanded,
  SanityOrderStepGroup,
} from "@/sanity/lib/types";

interface PaymentSectionProps {
  storeLocations: SanityStoreLocation[];
  postenOptions: SanityPostenOption[];
  deliveryOptions: SanityDeliveryOption[];
  pricing: SanityPricing | null;
  siteSettings: SanitySiteSettings | null;
  garments: SanityGarment[];
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

export default function PaymentSection(props: PaymentSectionProps) {
  // For now, just wrap the existing PaymentPageClient
  // This can be refactored later to integrate orderFlowConfig if needed
  return <PaymentPageClient {...props} />;
}
