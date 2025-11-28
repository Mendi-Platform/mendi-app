"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check } from "lucide-react";

const OrderSteps = () => {
  const pathname = usePathname();
  const { language } = useLanguage();

  const labels = {
    // Main steps
    orderDetails: language === "nb" ? "Bestillingsdetaljer" : "Order Details",
    delivery: language === "nb" ? "Levering" : "Delivery",
    payment: language === "nb" ? "Betaling" : "Payment",
    // Sub-steps
    garment: language === "nb" ? "Plagg" : "Garment",
    service: language === "nb" ? "Tjeneste" : "Service",
    category: language === "nb" ? "Kategori" : "Category",
    leatherType: language === "nb" ? "Skinntype" : "Leather Type",
    twoOption: language === "nb" ? "Valg" : "Options",
    measurement: language === "nb" ? "Mål" : "Measurement",
    measurementDetails: language === "nb" ? "Måldetaljer" : "Measurement Details",
    quantity: language === "nb" ? "Antall" : "Quantity",
    markDamage: language === "nb" ? "Marker skade" : "Mark Damage",
    addImage: language === "nb" ? "Legg til bilde" : "Add Image",
    additionalDetails: language === "nb" ? "Tilleggsdetaljer" : "Additional Details",
    otherRequest: language === "nb" ? "Annen forespørsel" : "Other Request",
    cart: language === "nb" ? "Handlekurv" : "Cart",
    deliveryChoice: language === "nb" ? "Leveringsvalg" : "Delivery Choice",
    checkout: language === "nb" ? "Kasse" : "Checkout",
  };

  // Define detailed order flow with labels
  const orderFlow = [
    { path: "/order/garment", label: labels.garment, step: 1 },
    { path: "/order/service", label: labels.service, step: 1 },
    { path: "/order/category", label: labels.category, step: 1 },
    { path: "/order/leather-type", label: labels.leatherType, step: 1 },
    { path: "/order/two-option", label: labels.twoOption, step: 1 },
    { path: "/order/measurement", label: labels.measurement, step: 1 },
    { path: "/order/measurement-details", label: labels.measurementDetails, step: 1 },
    { path: "/order/quantity", label: labels.quantity, step: 1 },
    { path: "/order/mark-damage", label: labels.markDamage, step: 1 },
    { path: "/order/add-image", label: labels.addImage, step: 1 },
    { path: "/order/additional-details", label: labels.additionalDetails, step: 1 },
    { path: "/order/other-request-info", label: labels.otherRequest, step: 1 },
    { path: "/order/cart", label: labels.cart, step: 2 },
    { path: "/order/delivery-choice", label: labels.deliveryChoice, step: 2 },
    { path: "/order/checkout", label: labels.checkout, step: 3 },
    { path: "/order/payment", label: labels.payment, step: 3 },
  ];

  // Find current page in flow
  const currentIndex = orderFlow.findIndex((page) => page.path === pathname);
  const currentPage = orderFlow[currentIndex];

  // Don't show on confirmation page
  if (pathname === "/order/confirmation" || currentIndex === -1) {
    return null;
  }

  // Calculate progress percentage
  const progressPercentage = ((currentIndex + 1) / orderFlow.length) * 100;

  // Determine step status
  const step1Complete = currentPage?.step > 1;
  const step2Complete = currentPage?.step > 2;
  const currentStep = currentPage?.step || 1;

  return (
    <div className="mb-8 max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-1.5 bg-bg-default rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-text-secondary text-center">
          {currentPage?.label} ({currentIndex + 1}/{orderFlow.length})
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {/* Step 1: Order Details */}
        <div className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
                step1Complete
                  ? "bg-brand-primary text-white"
                  : currentStep === 1
                  ? "bg-brand-primary text-white"
                  : "bg-bg-default text-text-secondary border-2 border-border-default"
              }`}
            >
              {step1Complete ? <Check size={18} /> : "1"}
            </div>
            <span
              className={`mt-2 text-xs font-medium text-center ${
                currentStep === 1 || step1Complete ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {labels.orderDetails}
            </span>
          </div>
          <div className={`h-0.5 flex-1 -mt-6 ${step1Complete ? "bg-brand-primary" : "bg-border-default"}`} />
        </div>

        {/* Step 2: Delivery */}
        <div className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
                step2Complete
                  ? "bg-brand-primary text-white"
                  : currentStep === 2
                  ? "bg-brand-primary text-white"
                  : "bg-bg-default text-text-secondary border-2 border-border-default"
              }`}
            >
              {step2Complete ? <Check size={18} /> : "2"}
            </div>
            <span
              className={`mt-2 text-xs font-medium text-center ${
                currentStep === 2 || step2Complete ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {labels.delivery}
            </span>
          </div>
          <div className={`h-0.5 flex-1 -mt-6 ${step2Complete ? "bg-brand-primary" : "bg-border-default"}`} />
        </div>

        {/* Step 3: Payment */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
              currentStep === 3
                ? "bg-brand-primary text-white"
                : "bg-bg-default text-text-secondary border-2 border-border-default"
            }`}
          >
            3
          </div>
          <span
            className={`mt-2 text-xs font-medium text-center ${
              currentStep === 3 ? "text-text-primary" : "text-text-secondary"
            }`}
          >
            {labels.payment}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSteps;
