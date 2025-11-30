"use client";

import ExpandableButtonOption from "@/components/ui/expandableButtonOption";
import ButtonWithTextInput from "@/components/ui/buttonWithTextInput";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import CheckoutWizard from "@/components/checkout/CheckoutWizard";
import { DeliveryType } from "@/constants/delivery";
import type {
  SanityStoreLocation,
  SanityPostenOption,
  SanityDeliveryOption,
  SanityPricing,
  SanitySiteSettings,
  OrderFlowStepExpanded,
  SanityOrderStepGroup,
} from "@/sanity/lib/types";
import { getLocalizedValue, getLocalizedArray } from "@/sanity/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";
import type { GarmentSlug, RepairTypeSlug } from "@/types/formData";

const getDeliveryStatusLabel = (
  language: 'nb' | 'en',
  selectedDelivery: DeliveryType,
  storeLocations: SanityStoreLocation[],
  selectedStore: string,
  storeSelected: boolean,
  postenOptions: SanityPostenOption[],
  selectedPosten: string,
  postenSelected: boolean,
  syerInput: string,
  syerSubmitted: boolean,
  postenOption?: SanityDeliveryOption,
) => {
  const fallback = language === 'nb' ? 'Ingen leveringsmåte valgt' : 'No delivery method selected';

  if (selectedDelivery === DeliveryType.PickupPoint) {
    if (storeSelected && selectedStore) {
      const storeName = storeLocations.find(store => store._id === selectedStore)?.name;
      if (storeName) {
        return language === 'nb' ? `Drop-off i ${storeName}` : `Drop-off at ${storeName}`;
      }
    }
    return language === 'nb' ? 'Velg butikk' : 'Choose store';
  }

  if (selectedDelivery === DeliveryType.Posten) {
    if (postenSelected && selectedPosten) {
      const postenChoice = postenOptions.find(opt => opt._id === selectedPosten);
      const choiceName = getLocalizedValue(postenChoice?.name, language);
      if (choiceName) {
        return choiceName;
      }
    }
    const defaultLabel = getLocalizedValue(postenOption?.name, language) || 'Posten';
    return language === 'nb' ? `Velg ${defaultLabel}` : `Choose ${defaultLabel}`;
  }

  if (selectedDelivery === DeliveryType.Syer) {
    if (syerSubmitted && syerInput.trim().length > 0) {
      return syerInput.trim();
    }
    return language === 'nb' ? 'Møt en syer' : 'Meet a tailor';
  }

  return fallback;
};

// Helper to get garment label from slug
const getGarmentLabelFromSlug = (slug: GarmentSlug | undefined, lang: 'nb' | 'en'): string => {
  if (!slug) return '';
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
const getRepairTypeLabelFromSlug = (slug: RepairTypeSlug | undefined, lang: 'nb' | 'en'): string => {
  if (!slug) return '';
  const labels: Record<RepairTypeSlug, { nb: string; en: string }> = {
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

interface DeliverySectionProps {
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

export default function DeliverySection({
  storeLocations,
  postenOptions,
  deliveryOptions,
  pricing,
  siteSettings,
  orderFlowConfig,
}: DeliverySectionProps) {
  const { language } = useLanguage();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);
  const { cart } = useCart();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType>(DeliveryType.None);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [storeSelected, setStoreSelected] = useState<boolean>(false);
  const [selectedPosten, setSelectedPosten] = useState<string>("");
  const [postenSelected, setPostenSelected] = useState<boolean>(false);
  const [syerInput, setSyerInput] = useState("");
  const [syerSubmitted, setSyerSubmitted] = useState(false);

  // Get colors from site settings or use defaults
  const colors = {
    primary: siteSettings?.primaryColor || '#006EFF',
    textSecondary: siteSettings?.textSecondaryColor || '#797979',
    textDisabled: siteSettings?.textDisabledColor || '#A7A7A7',
  };

  // Get delivery options from Sanity
  const pickupOption = deliveryOptions.find(o => o.type === 'pickup_point');
  const syerOption = deliveryOptions.find(o => o.type === 'syer');
  const postenOption = deliveryOptions.find(o => o.type === 'posten');

  // Transform store locations for ExpandableButtonOption
  const storeOptions = storeLocations.map(store => ({
    id: store._id,
    name: store.name,
    subText: store.address,
  }));

  // Transform posten options for ExpandableButtonOption
  const postenOptionsFormatted = postenOptions.map(opt => ({
    id: opt._id,
    name: getLocalizedValue(opt.name, language),
    subText: getLocalizedValue(opt.description, language),
    price: opt.price,
  }));

  // Load delivery state from localStorage on mount
  useEffect(() => {
    const savedDeliveryState = localStorage.getItem('deliveryState');
    if (savedDeliveryState) {
      const parsed = JSON.parse(savedDeliveryState);
      setSelectedDelivery(parsed.selectedDelivery || DeliveryType.None);
      setSelectedStore(parsed.selectedStore || "");
      setStoreSelected(parsed.storeSelected || false);
      setSelectedPosten(parsed.selectedPosten || "");
      setPostenSelected(parsed.postenSelected || false);
      setSyerInput(parsed.syerInput || "");
      setSyerSubmitted(parsed.syerSubmitted || false);
    }
  }, []);

  // Save delivery state to localStorage whenever it changes
  useEffect(() => {
    const deliveryState = {
      selectedDelivery,
      selectedStore,
      storeSelected,
      selectedPosten,
      postenSelected,
      syerInput,
      syerSubmitted,
    };
    localStorage.setItem('deliveryState', JSON.stringify(deliveryState));
  }, [selectedDelivery, selectedStore, storeSelected, selectedPosten, postenSelected, syerInput, syerSubmitted]);

  // Static cart item
  const staticCartItem = {
    id: "static-1",
    repairTypeSlug: 'hemming' as RepairTypeSlug,
    garmentSlug: 'upper-body' as GarmentSlug,
    categorySlug: 'standard',
    price: pricing?.staticItemPrice || 199,
  };

  const onChoice = (value: DeliveryType) => {
    if (selectedDelivery === value) {
      setSelectedDelivery(DeliveryType.None);
      setSelectedStore("");
      setStoreSelected(false);
      setSelectedPosten("");
      setPostenSelected(false);
      setSyerSubmitted(false);
      setSyerInput("");
    } else {
      setSelectedDelivery(value);
      if (value !== DeliveryType.PickupPoint) {
        setSelectedStore("");
        setStoreSelected(false);
      }
      if (value !== DeliveryType.Posten) {
        setSelectedPosten("");
        setPostenSelected(false);
      }
      if (value !== DeliveryType.Syer) {
        setSyerSubmitted(false);
        setSyerInput("");
      }
    }
  };

  const handleContinue = () => {
    navigateToNext('delivery-choice');
  };

  const handleStoreSelection = () => setStoreSelected(true);
  const handleEditStore = () => setStoreSelected(false);
  const handleDeleteStore = () => {
    setSelectedDelivery(DeliveryType.None);
    setSelectedStore("");
    setStoreSelected(false);
  };

  const handleDropoffClick = () => {
    if (selectedDelivery === DeliveryType.PickupPoint) {
      setSelectedDelivery(DeliveryType.None);
      setSelectedStore("");
      setStoreSelected(false);
    } else {
      onChoice(DeliveryType.PickupPoint);
    }
  };

  const handleSyerClick = () => {
    if (selectedDelivery === DeliveryType.Syer) {
      setSelectedDelivery(DeliveryType.None);
      setSyerSubmitted(false);
      setSyerInput("");
    } else {
      onChoice(DeliveryType.Syer);
    }
  };

  const handlePostenClick = () => {
    if (selectedDelivery === DeliveryType.Posten) {
      setSelectedDelivery(DeliveryType.None);
      setSelectedPosten("");
      setPostenSelected(false);
    } else {
      onChoice(DeliveryType.Posten);
    }
  };

  const handlePostenSelection = () => setPostenSelected(true);
  const handleEditPosten = () => setPostenSelected(false);
  const handleDeletePosten = () => {
    setSelectedDelivery(DeliveryType.None);
    setSelectedPosten("");
    setPostenSelected(false);
  };

  const handleSyerInputChange = (value: string) => setSyerInput(value);
  const handleSyerInputSubmit = (value: string) => {
    setSyerInput(value);
    setSyerSubmitted(true);
  };
  const handleSyerEdit = () => setSyerSubmitted(false);
  const handleSyerDelete = () => {
    setSelectedDelivery(DeliveryType.None);
    setSyerSubmitted(false);
    setSyerInput("");
  };

  const steps = getLocalizedArray(siteSettings?.deliverySteps, language);
  const currentStep = 2;

  // Calculate totals
  const allItems = [staticCartItem, ...cart];
  const subtotal = allItems.reduce((sum, item) => sum + (item.price || 0), 0);

  // Calculate shipping cost from Sanity data
  const calculateShippingCost = () => {
    if (selectedDelivery === DeliveryType.PickupPoint) {
      return pickupOption?.price || 0;
    }
    if (selectedDelivery === DeliveryType.Syer) {
      return syerOption?.price || 99;
    }
    if (selectedDelivery === DeliveryType.Posten && selectedPosten && postenSelected) {
      const selected = postenOptions.find(o => o._id === selectedPosten);
      return selected?.price || postenOption?.price || 158;
    }
    if (selectedDelivery === DeliveryType.Posten) {
      return postenOption?.price || 158;
    }
    return 0;
  };

  const shippingCost = calculateShippingCost();
  const total = subtotal + shippingCost;

  const canContinue = selectedDelivery !== DeliveryType.None &&
    (selectedDelivery !== DeliveryType.PickupPoint || (selectedStore !== "" && storeSelected)) &&
    (selectedDelivery !== DeliveryType.Posten || (selectedPosten !== "" && postenSelected)) &&
    (selectedDelivery !== DeliveryType.Syer || syerSubmitted);

  const minPostenPrice = Math.min(...postenOptions.map(o => o.price));

  const deliveryStatusLabel = getDeliveryStatusLabel(
    language,
    selectedDelivery,
    storeLocations,
    selectedStore,
    storeSelected,
    postenOptions,
    selectedPosten,
    postenSelected,
    syerInput,
    syerSubmitted,
    postenOption,
  );

  const currentStepLabel = steps?.[currentStep - 1] || (language === 'nb' ? 'Levering' : 'Delivery');
  const nextStepLabel = steps?.[currentStep] || (language === 'nb' ? 'Betaling' : 'Payment');
  const shippingChipLabel = selectedDelivery === DeliveryType.None
    ? `${language === 'nb' ? 'Fra' : 'From'} ${minPostenPrice} kr`
    : (shippingCost === 0 ? (language === 'nb' ? 'Gratis frakt' : 'Free shipping') : `${shippingCost} kr`);

  return (
    <CheckoutWizard
      steps={steps}
      currentStep={currentStep}
      showSummary={true}
      shippingCost={selectedDelivery !== DeliveryType.None ? shippingCost : undefined}
      shippingLabel={language === 'nb' ? "Frakt" : "Shipping"}
    >
      <div className="space-y-6">
        <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-white via-slate-50 to-[#E7F1FF] shadow-sm p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <span
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-semibold tracking-[0.08em]"
                style={{ color: colors.primary }}
              >
                {language === 'nb' ? 'Steg 2: Levering' : 'Step 2: Delivery'}
              </span>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {language === 'nb' ? 'Hvordan vil du levere plaggene?' : 'How do you want to hand over your garments?'}
                </h1>
                <p className="text-sm text-gray-600 max-w-2xl">
                  {language === 'nb'
                    ? 'Velg løsningen som passer dagen din - vi oppdaterer totalsummen og oppsummeringen med én gang.'
                    : 'Pick the option that fits your day - the total and summary update instantly.'}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 shadow-sm min-w-[220px]">
                <p className="text-xs uppercase tracking-[0.08em] text-gray-500">
                  {language === 'nb' ? 'Valgt alternativ' : 'Selected option'}
                </p>
                <p className="text-sm font-semibold text-gray-900 break-words mt-1">
                  {deliveryStatusLabel}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/90 px-4 py-3 shadow-sm min-w-[150px]">
                <p className="text-xs uppercase tracking-[0.08em] text-gray-500">
                  {language === 'nb' ? 'Frakt' : 'Shipping'}
                </p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{shippingChipLabel}</p>
                <p className="text-[11px] text-gray-500">
                  {language === 'nb' ? 'Oppdateres når du gjør et valg' : 'Updates as soon as you choose'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <div className="rounded-2xl border border-gray-200 bg-white/90 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.08em] text-gray-500">
                {language === 'nb' ? 'Plagg i bestilling' : 'Items in order'}
              </p>
              <p className="text-base font-semibold text-gray-900 mt-1">
                {allItems.length} {language === 'nb' ? 'stk' : 'pcs'}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/90 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.08em] text-gray-500">
                {language === 'nb' ? 'Nå' : 'Current step'}
              </p>
              <p className="text-base font-semibold text-gray-900 mt-1">{currentStepLabel}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/90 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.08em] text-gray-500">
                {language === 'nb' ? 'Neste' : 'Next'}
              </p>
              <p className="text-base font-semibold text-gray-900 mt-1">{nextStepLabel}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.08em] text-gray-500">
                {language === 'nb' ? 'Leveringsvalg' : 'Delivery options'}
              </p>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {language === 'nb' ? 'Velg leveringsmåte' : 'Choose delivery method'}
              </h2>
              <p className="text-sm text-gray-600">
                {language === 'nb'
                  ? 'Se tilgjengelige alternativer under. Du kan alltid gå tilbake og endre før du bekrefter.'
                  : 'Browse the options below. You can always adjust before confirming.'}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
                <span>{language === 'nb' ? 'Oppsummering oppdateres' : 'Summary updates live'}</span>
              </div>
              <span className="text-xs text-gray-500">
                {language === 'nb' ? 'Totalsummen justeres med frakten du velger' : 'Total reflects the shipping you choose'}
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {/* Drop-off i butikk */}
            <ExpandableButtonOption
              label={getLocalizedValue(pickupOption?.name, language) || (language === 'nb' ? 'Drop-off i butikk' : 'Drop-off at store')}
              price={pickupOption?.price === 0 ? (language === 'nb' ? 'Gratis' : 'Free') : `${pickupOption?.price} kr`}
              active={selectedDelivery === DeliveryType.PickupPoint}
              collapsed={storeSelected}
              options={storeOptions}
              selectedOption={selectedStore}
              onMainClick={handleDropoffClick}
              onOptionSelect={setSelectedStore}
              onConfirm={handleStoreSelection}
              onEdit={handleEditStore}
              onDelete={handleDeleteStore}
            />

            {/* Møt syer */}
            <ButtonWithTextInput
              label={getLocalizedValue(syerOption?.name, language) || (language === 'nb' ? 'Møt syer' : 'Meet tailor')}
              subText={getLocalizedValue(syerOption?.description, language) || ''}
              price={syerOption?.price || 99}
              inputLabel={language === 'nb' ? 'Forslag til møtested' : 'Suggested meeting place'}
              active={selectedDelivery === DeliveryType.Syer}
              submitted={syerSubmitted}
              inputValue={syerInput}
              inputPlaceholder={language === 'nb' ? 'Ved tigeren på Oslo S' : 'At the tiger at Oslo S'}
              onMainClick={handleSyerClick}
              onInputChange={handleSyerInputChange}
              onInputSubmit={handleSyerInputSubmit}
              onEdit={handleSyerEdit}
              onDelete={handleSyerDelete}
            />

            {/* Posten */}
            <ExpandableButtonOption
              label=""
              price={`${language === 'nb' ? 'Fra' : 'From'} ${minPostenPrice} kr`}
              logo={postenOption?.logo}
              active={selectedDelivery === DeliveryType.Posten}
              collapsed={postenSelected}
              options={postenOptionsFormatted}
              selectedOption={selectedPosten}
              onMainClick={handlePostenClick}
              onOptionSelect={setSelectedPosten}
              onConfirm={handlePostenSelection}
              onEdit={handleEditPosten}
              onDelete={handleDeletePosten}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-dashed border-gray-300 bg-slate-50/70 p-4 flex items-start gap-3">
          <div
            className="h-10 w-10 flex items-center justify-center rounded-xl text-sm font-semibold"
            style={{ backgroundColor: colors.primary, color: 'white' }}
          >
            i
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">
              {language === 'nb' ? 'Oppdateres fortløpende' : 'Live updates'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'nb'
                ? 'Oppsummeringen viser valgt levering og frakt så fort du markerer et alternativ.'
                : 'The summary reflects your delivery and shipping choice as soon as you pick it.'}
            </p>
          </div>
        </div>

        {/* Mobile Order Summary */}
        <div className="lg:hidden">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 space-y-3">
            <div className="space-y-2">
              {allItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    {getRepairTypeLabelFromSlug(item.repairTypeSlug, language)} - {getGarmentLabelFromSlug(item.garmentSlug, language)}
                  </span>
                  <span className="text-sm">{item.price} kr</span>
                </div>
              ))}
            </div>

            {selectedDelivery !== DeliveryType.None && (
              <div className="flex justify-between items-center pt-1">
                <span className="text-sm" style={{ color: colors.textSecondary }}>
                  {language === 'nb' ? 'Frakt' : 'Shipping'}
                </span>
                <span className="text-sm">
                  {shippingCost === 0 ? (language === 'nb' ? 'Gratis' : 'Free') : `${shippingCost} kr`}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-gray-200 pt-3">
              <span className="font-medium">
                {language === 'nb' ? 'Total sum' : 'Total'}{' '}
                <span className="text-xs font-normal" style={{ color: colors.textSecondary }}>
                  ({language === 'nb' ? 'inkl. mva.' : 'incl. VAT'})
                </span>
              </span>
              <span className="font-medium">{total} kr</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full rounded-[18px] text-lg font-semibold transition-all duration-150 ${canContinue ? 'shadow-lg hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2' : 'border border-gray-200 bg-white cursor-not-allowed'}`}
          style={{
            backgroundColor: canContinue ? colors.primary : 'white',
            color: canContinue ? 'white' : colors.textDisabled,
            border: canContinue ? 'none' : '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <span className="block w-full py-3">
            {language === 'nb' ? 'Til betaling' : 'To payment'}
          </span>
        </button>
      </div>
    </CheckoutWizard>
  );
}
