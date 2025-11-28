"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { createOrder, type CartItemWithMeta } from "@/lib/orders";
import Stepper from "@/components/ui/stepper";
import CategoryCard from "@/components/ui/categoryCard";
import ButtonWithTextInput from "@/components/ui/buttonWithTextInput";
import ExpandableButtonOption from "@/components/ui/expandableButtonOption";
import type { FormData, GarmentSlug } from "@/types/formData";
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
import { getLocalizedValue, getLocalizedArray } from "@/sanity/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { DeliveryType } from "@/constants/delivery";

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

// Helper to get logo URL from garments array
const getLogoBySlug = (garmentSlug: GarmentSlug, garments: SanityGarment[]): string | undefined => {
  const garment = garments.find(g => g.slug.current === garmentSlug);
  return garment?.icon;
};

// Helper to get garment label from slug
const getGarmentLabelFromSlug = (slug: GarmentSlug, lang: 'nb' | 'en'): string => {
  const labels: Record<GarmentSlug, { nb: string; en: string }> = {
    '': { nb: '', en: '' },
    'upper-body': { nb: 'Overdel', en: 'Upper body' },
    'lower-body': { nb: 'Underdel', en: 'Lower body' },
    'kjole': { nb: 'Kjole', en: 'Dress' },
    'dress': { nb: 'Dress', en: 'Suit' },
    'outer-wear': { nb: 'Jakke/Yttertøy', en: 'Jacket/Outerwear' },
    'leather-items': { nb: 'Skinnplagg', en: 'Leather items' },
    'curtains': { nb: 'Gardiner', en: 'Curtains' },
  };
  return labels[slug]?.[lang] || '';
};

// Helper to get repair type label from slug
const getRepairTypeLabelFromSlug = (slug: string, lang: 'nb' | 'en'): string => {
  const labels: Record<string, { nb: string; en: string }> = {
    '': { nb: '', en: '' },
    'replace-zipper': { nb: 'Bytte glidelås', en: 'Replace zipper' },
    'sew-button': { nb: 'Sy på ny knapp', en: 'Sew button' },
    'hole': { nb: 'Hull', en: 'Hole' },
    'small-hole': { nb: 'Lite hull', en: 'Small hole' },
    'big-hole': { nb: 'Stort hull', en: 'Big hole' },
    'belt-loops': { nb: 'Fest på beltehemper', en: 'Belt loops' },
    'hemming': { nb: 'Legge opp', en: 'Hemming' },
    'adjust-waist': { nb: 'Ta inn i livet', en: 'Adjust waist' },
    'other-request': { nb: 'Annen forespørsel', en: 'Other request' },
  };
  return labels[slug]?.[lang] || '';
};

export default function PaymentSection({
  storeLocations,
  postenOptions,
  deliveryOptions,
  pricing,
  siteSettings,
  garments,
  orderFlowConfig: _orderFlowConfig,
}: PaymentSectionProps) {
  const { language } = useLanguage();
  const { cart } = useCart();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Delivery state
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType>(DeliveryType.None);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [storeSelected, setStoreSelected] = useState<boolean>(false);
  const [selectedPosten, setSelectedPosten] = useState<string>("");
  const [postenSelected, setPostenSelected] = useState<boolean>(false);
  const [syerInput, setSyerInput] = useState("");
  const [syerSubmitted, setSyerSubmitted] = useState(false);

  // Coupon state
  const [couponActive, setCouponActive] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponSubmitted, setCouponSubmitted] = useState(false);

  // Delivery expansion state
  const [deliveryExpanded, setDeliveryExpanded] = useState(false);

  // Get colors from site settings
  const colors = {
    primary: siteSettings?.primaryColor || '#006EFF',
    textSecondary: siteSettings?.textSecondaryColor || '#797979',
    textDisabled: siteSettings?.textDisabledColor || '#A7A7A7',
  };

  // Static item price from Sanity
  const staticItemPrice = pricing?.staticItemPrice || 199;

  // Get delivery options from Sanity
  const pickupOption = deliveryOptions.find(o => o.type === 'pickup_point');
  const syerOption = deliveryOptions.find(o => o.type === 'syer');
  const postenDeliveryOption = deliveryOptions.find(o => o.type === 'posten');

  // Transform store locations for ExpandableButtonOption
  const storeOptionsFormatted = storeLocations.map(store => ({
    id: store._id,
    name: store.name,
    subText: store.address,
    price: store.price,
  }));

  // Transform posten options for ExpandableButtonOption
  const postenOptionsFormatted = postenOptions.map(opt => ({
    id: opt._id,
    name: getLocalizedValue(opt.name, language),
    subText: getLocalizedValue(opt.description, language),
    price: opt.price,
  }));

  // Static cart item
  const staticCartItem = {
    id: "static-1",
    title: language === 'nb' ? 'Statisk vare' : 'Static item',
    logo: getLogoBySlug('upper-body' as GarmentSlug, garments),
    price: staticItemPrice,
    formData: {
      categorySlug: 'standard',
      serviceSlug: 'repair',
      repairTypeSlug: 'hemming',
      materialSlug: 'normal',
      garmentSlug: 'upper-body',
      mainCategorySlug: 'clothes',
      description: language === 'nb' ? 'Dette er en statisk vare.' : 'This is a static item.',
      repairDetails: {},
      price: staticItemPrice,
    } as FormData,
  };

  // Load delivery state from localStorage on mount
  useEffect(() => {
    const savedDeliveryState = localStorage.getItem('deliveryState');
    if (savedDeliveryState) {
      try {
        const parsed = JSON.parse(savedDeliveryState);
        setSelectedDelivery(parsed.selectedDelivery || DeliveryType.None);
        setSelectedStore(parsed.selectedStore || "");
        setStoreSelected(parsed.storeSelected || false);
        setSelectedPosten(parsed.selectedPosten || "");
        setPostenSelected(parsed.postenSelected || false);
        setSyerInput(parsed.syerInput || "");
        setSyerSubmitted(parsed.syerSubmitted || false);
      } catch (error) {
        console.error('Error parsing delivery state:', error);
      }
    }
  }, []);

  // Combine static and dynamic cart items
  const allCartItems = [
    staticCartItem,
    ...cart.map(item => ({
      ...item,
      title:
        item.repairTypeSlug && item.garmentSlug
          ? `${getRepairTypeLabelFromSlug(item.repairTypeSlug, language)}\n${getGarmentLabelFromSlug(item.garmentSlug, language)}\n${item.categorySlug === 'standard' ? "Standard" : item.categorySlug === 'premium' ? "Premium" : ""}`
          : item.description || (language === 'nb' ? 'Dynamisk vare' : 'Dynamic item'),
      logo: getLogoBySlug(item.garmentSlug, garments),
      formData: item,
      price: item.price || 0,
      id: typeof item.id === "string" ? item.id : String(item.id),
    })),
  ];

  const steps = getLocalizedArray(siteSettings?.checkoutSteps, language) || [
    language === 'nb' ? 'Adresse' : 'Address',
    language === 'nb' ? 'Levering' : 'Delivery',
    language === 'nb' ? 'Betaling' : 'Payment'
  ];
  const currentStep = 3;

  // Helper function to update localStorage
  const updateLocalStorage = (updates: Partial<{
    selectedDelivery: string;
    selectedStore: string;
    storeSelected: boolean;
    selectedPosten: string;
    postenSelected: boolean;
    syerInput: string;
    syerSubmitted: boolean;
  }>) => {
    const currentState = {
      selectedDelivery,
      selectedStore,
      storeSelected,
      selectedPosten,
      postenSelected,
      syerInput,
      syerSubmitted,
      ...updates
    };
    localStorage.setItem('deliveryState', JSON.stringify(currentState));
  };

  // Toggle handlers
  const handleDropoffClick = () => setDeliveryExpanded(!deliveryExpanded);
  const handleSyerClick = () => setDeliveryExpanded(!deliveryExpanded);
  const handlePostenClick = () => setDeliveryExpanded(!deliveryExpanded);

  // Store handlers
  const handleStoreSelection = () => {
    setStoreSelected(true);
    updateLocalStorage({ storeSelected: true });
  };
  const handleEditStore = () => {
    setStoreSelected(false);
    updateLocalStorage({ storeSelected: false });
  };
  const handleDeleteStore = () => {
    setSelectedDelivery(DeliveryType.None);
    setSelectedStore("");
    setStoreSelected(false);
    setDeliveryExpanded(false);
    updateLocalStorage({ selectedDelivery: DeliveryType.None, selectedStore: "", storeSelected: false });
  };

  // Posten handlers
  const handlePostenSelection = () => {
    setPostenSelected(true);
    updateLocalStorage({ postenSelected: true });
  };
  const handleEditPosten = () => {
    setPostenSelected(false);
    updateLocalStorage({ postenSelected: false });
  };
  const handleDeletePosten = () => {
    setSelectedDelivery(DeliveryType.None);
    setSelectedPosten("");
    setPostenSelected(false);
    setDeliveryExpanded(false);
    updateLocalStorage({ selectedDelivery: DeliveryType.None, selectedPosten: "", postenSelected: false });
  };

  // Syer handlers
  const handleSyerInputChange = (value: string) => setSyerInput(value);
  const handleSyerInputSubmit = (value: string) => {
    setSyerInput(value);
    setSyerSubmitted(true);
    updateLocalStorage({ syerInput: value, syerSubmitted: true });
  };
  const handleSyerEdit = () => {
    setSyerSubmitted(false);
    updateLocalStorage({ syerSubmitted: false });
  };
  const handleSyerDelete = () => {
    setSelectedDelivery(DeliveryType.None);
    setSyerSubmitted(false);
    setSyerInput("");
    setDeliveryExpanded(false);
    updateLocalStorage({ selectedDelivery: DeliveryType.None, syerSubmitted: false, syerInput: "" });
  };

  // Coupon handlers
  const handleCouponClick = () => setCouponActive(!couponActive);
  const handleCouponInputChange = (value: string) => setCouponInput(value);
  const handleCouponSubmit = (value: string) => {
    setCouponInput(value);
    setCouponSubmitted(true);
  };
  const handleCouponEdit = () => setCouponSubmitted(false);
  const handleCouponDelete = () => {
    setCouponActive(false);
    setCouponSubmitted(false);
    setCouponInput("");
  };

  // Calculate totals
  const subtotal = allCartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  const getShippingCost = () => {
    if (selectedDelivery === DeliveryType.PickupPoint) {
      return pickupOption?.price || 0;
    }
    if (selectedDelivery === DeliveryType.Syer) {
      return syerOption?.price || 99;
    }
    if (selectedDelivery === DeliveryType.Posten && selectedPosten && postenSelected) {
      const selected = postenOptions.find(o => o._id === selectedPosten);
      return selected?.price || postenDeliveryOption?.price || 158;
    }
    if (selectedDelivery === DeliveryType.Posten) {
      return postenDeliveryOption?.price || 158;
    }
    return 0;
  };

  const shippingCost = getShippingCost();
  const total = subtotal + shippingCost;
  const minPostenPrice = Math.min(...postenOptions.map(o => o.price));

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentError(null);

    try {
      // Prepare cart items with metadata for order creation
      const orderItems: CartItemWithMeta[] = allCartItems.map(item => ({
        ...item.formData,
        id: item.id,
        title: item.title,
      }));

      // Get delivery details
      const deliveryDetails: {
        selectedStore?: string;
        selectedPosten?: string;
        syerMeetingPlace?: string;
      } = {};

      if (selectedDelivery === DeliveryType.PickupPoint && selectedStore) {
        deliveryDetails.selectedStore = selectedStore;
      } else if (selectedDelivery === DeliveryType.Posten && selectedPosten) {
        deliveryDetails.selectedPosten = selectedPosten;
      } else if (selectedDelivery === DeliveryType.Syer && syerInput) {
        deliveryDetails.syerMeetingPlace = syerInput;
      }

      // 1. Create order in Firestore
      const orderId = await createOrder({
        items: orderItems,
        subtotal,
        shippingCost,
        total,
        deliveryMethod: selectedDelivery,
        deliveryDetails,
      });

      // 2. Create Stripe checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          items: orderItems,
          shippingCost,
          total,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // 3. Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : 'Det oppsto en feil. Vennligst prøv igjen.'
      );
      setIsLoading(false);
    }
  };

  // i18n labels
  const labels = {
    title: language === 'nb' ? 'Betaling' : 'Payment',
    subtitle: language === 'nb' ? 'Bestill en ordre og betal - enkelt og smidig!' : 'Place an order and pay - simple and smooth!',
    noDelivery: language === 'nb' ? 'Ingen leveringsmetode valgt' : 'No delivery method selected',
    couponLabel: language === 'nb' ? 'Gavekort eller rabattkode' : 'Gift card or discount code',
    couponPlaceholder: 'COUPON',
    couponInputLabel: language === 'nb' ? 'Lov inn din rabattkode her.' : 'Enter your discount code here.',
    shipping: language === 'nb' ? 'Frakt' : 'Shipping',
    free: language === 'nb' ? 'Gratis' : 'Free',
    total: language === 'nb' ? 'Total sum' : 'Total',
    inclVat: language === 'nb' ? 'inkl. mva.' : 'incl. VAT',
    payWithCard: language === 'nb' ? 'Betal med kort' : 'Pay with card',
    processing: language === 'nb' ? 'Behandler...' : 'Processing...',
    dropOff: getLocalizedValue(pickupOption?.name, language) || (language === 'nb' ? 'Drop-off i butikk' : 'Drop-off at store'),
    meetTailor: getLocalizedValue(syerOption?.name, language) || (language === 'nb' ? 'Møt syer' : 'Meet tailor'),
    meetTailorSubtext: getLocalizedValue(syerOption?.description, language) || '',
    meetingPlaceLabel: language === 'nb' ? 'Forslag til møtested' : 'Suggested meeting place',
    meetingPlacePlaceholder: language === 'nb' ? 'Ved tigeren på Oslo S' : 'At the tiger at Oslo S',
  };

  return (
    <div
      className="w-full h-screen overflow-y-auto"
      style={{ WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
    >
      <div className="w-full max-w-md mx-auto px-4 py-8">
        <div className="mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        <h1 className="font-medium text-lg mb-2">{labels.title}</h1>
        <p className="text-sm mb-8" style={{ color: colors.textSecondary }}>
          {labels.subtitle}
        </p>

        {/* Service Details */}
        <div className="mb-6">
          <div className="flex flex-col gap-4">
            {allCartItems.map(item => (
              <CategoryCard
                key={item.id}
                title={item.title}
                logo={item.logo}
                isActive={activeId === item.id}
                onClick={() => setActiveId(activeId === item.id ? null : item.id)}
                formData={item.formData}
                variant="cart"
              />
            ))}
          </div>
        </div>

        {/* Delivery Options */}
        <div className="mb-6">
          <div className="flex flex-col gap-4">
            {selectedDelivery === DeliveryType.PickupPoint && (
              <ExpandableButtonOption
                label={labels.dropOff}
                price={pickupOption?.price === 0 ? labels.free : `${pickupOption?.price} kr`}
                active={deliveryExpanded}
                collapsed={storeSelected}
                options={storeOptionsFormatted}
                selectedOption={selectedStore}
                onMainClick={handleDropoffClick}
                onOptionSelect={setSelectedStore}
                onConfirm={handleStoreSelection}
                onEdit={handleEditStore}
                onDelete={handleDeleteStore}
              />
            )}

            {selectedDelivery === DeliveryType.Syer && (
              <ButtonWithTextInput
                label={labels.meetTailor}
                subText={labels.meetTailorSubtext}
                price={syerOption?.price || 99}
                inputLabel={labels.meetingPlaceLabel}
                active={deliveryExpanded}
                submitted={syerSubmitted}
                inputValue={syerInput}
                inputPlaceholder={labels.meetingPlacePlaceholder}
                onMainClick={handleSyerClick}
                onInputChange={handleSyerInputChange}
                onInputSubmit={handleSyerInputSubmit}
                onEdit={handleSyerEdit}
                onDelete={handleSyerDelete}
              />
            )}

            {selectedDelivery === DeliveryType.Posten && (
              <ExpandableButtonOption
                label=""
                price={`${language === 'nb' ? 'Fra' : 'From'} ${minPostenPrice} kr`}
                logo={postenDeliveryOption?.logo}
                active={deliveryExpanded}
                collapsed={postenSelected}
                options={postenOptionsFormatted}
                selectedOption={selectedPosten}
                onMainClick={handlePostenClick}
                onOptionSelect={setSelectedPosten}
                onConfirm={handlePostenSelection}
                onEdit={handleEditPosten}
                onDelete={handleDeletePosten}
              />
            )}

            {selectedDelivery === DeliveryType.None && (
              <div className="p-4 border border-gray-200 rounded-lg text-center" style={{ color: colors.textSecondary }}>
                {labels.noDelivery}
              </div>
            )}
          </div>
        </div>

        {/* Coupon */}
        <div className="mb-6">
          <ButtonWithTextInput
            label={labels.couponLabel}
            active={couponActive}
            submitted={couponSubmitted}
            inputValue={couponInput}
            inputPlaceholder={labels.couponPlaceholder}
            inputLabel={labels.couponInputLabel}
            onMainClick={handleCouponClick}
            onInputChange={handleCouponInputChange}
            onInputSubmit={handleCouponSubmit}
            onEdit={handleCouponEdit}
            onDelete={handleCouponDelete}
          />
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <div className="space-y-2 mb-4">
            {allCartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {getRepairTypeLabelFromSlug(item.formData.repairTypeSlug, language)} - {getGarmentLabelFromSlug(item.formData.garmentSlug, language)}
                </span>
                <span className="text-sm">{item.price} kr</span>
              </div>
            ))}
          </div>

          {selectedDelivery !== DeliveryType.None && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm" style={{ color: colors.textSecondary }}>{labels.shipping}</span>
              <span className="text-sm">{shippingCost === 0 ? labels.free : `${shippingCost} kr`}</span>
            </div>
          )}

          <div className="flex justify-between items-center border-t border-gray-200 pt-2">
            <span className="font-medium">
              {labels.total} <span className="text-xs font-normal" style={{ color: colors.textSecondary }}>({labels.inclVat})</span>
            </span>
            <span className="font-medium">{total} kr</span>
          </div>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {paymentError}
          </div>
        )}

        {/* Payment Button */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={isLoading}
          className="block w-full text-center py-3 rounded-[20px] text-xl font-semibold text-white hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: colors.primary }}
        >
          {isLoading ? labels.processing : labels.payWithCard}
        </button>
      </div>
    </div>
  );
}
