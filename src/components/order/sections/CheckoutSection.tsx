"use client";

import CheckoutClient from "@/app/(order)/order/checkout/CheckoutClient";
import type {
  SanityStoreLocation,
  SanityPostenOption,
  SanityDeliveryOption,
  SanityPricing,
  SanitySiteSettings,
  OrderFlowStepExpanded,
  SanityOrderStepGroup,
} from "@/sanity/lib/types";

interface CheckoutSectionProps {
  storeLocations: SanityStoreLocation[];
  postenOptions: SanityPostenOption[];
  deliveryOptions: SanityDeliveryOption[];
  pricing: SanityPricing | null;
  siteSettings: SanitySiteSettings | null;
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  };
}

export default function CheckoutSection(props: CheckoutSectionProps) {
  // For now, just wrap the existing CheckoutClient
  // This can be refactored later to integrate orderFlowConfig if needed
  return <CheckoutClient {...props} />;
}
