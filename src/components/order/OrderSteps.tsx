"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Check, ChevronLeft } from "lucide-react";

const OrderSteps = () => {
  const pathname = usePathname();
  const router = useRouter();
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
    // Modal
    goBackTitle: language === "nb" ? "Gå tilbake?" : "Go back?",
    goBackMessage: language === "nb"
      ? "Du kan gå tilbake og endre informasjonen din når som helst."
      : "You can go back and change your information at any time.",
    cancel: language === "nb" ? "Avbryt" : "Cancel",
    goBack: language === "nb" ? "Gå tilbake" : "Go back",
    previous: language === "nb" ? "Forrige" : "Previous",
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

  // Handle navigation
  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      // Going back - find the first page of that step
      const targetPage = orderFlow.find((page) => page.step === step);
      if (targetPage) {
        router.push(targetPage.path);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const previousPage = orderFlow[currentIndex - 1];
      router.push(previousPage.path);
    }
  };

  return (
    <div className="mb-8 max-w-md lg:max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-1.5 bg-bg-default rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="flex items-center gap-1 text-brand-primary hover:text-brand-primary-hover transition-colors"
            >
              <ChevronLeft size={14} />
              {labels.previous}
            </button>
          )}
          <div className={`text-text-secondary ${currentIndex === 0 ? "w-full text-center" : "ml-auto"}`}>
            {currentPage?.label} ({Math.round(progressPercentage)}%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSteps;
