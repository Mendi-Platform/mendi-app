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

interface DeliveryChoiceClientProps {
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
  } | null;
}

const DeliveryChoiceClient = ({
  storeLocations,
  postenOptions,
  deliveryOptions,
  pricing,
  siteSettings,
  orderFlowConfig,
}: DeliveryChoiceClientProps) => {
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

  return (
    <CheckoutWizard
      steps={steps}
      currentStep={currentStep}
      showSummary={true}
      shippingCost={selectedDelivery !== DeliveryType.None ? shippingCost : undefined}
      shippingLabel={language === 'nb' ? "Frakt" : "Shipping"}
    >
      <h1 className="font-medium text-lg mb-8">
        {language === 'nb' ? 'Velg leveringsmåte' : 'Choose delivery method'}
      </h1>

      <div className="flex flex-col gap-4 mb-8">
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

      {/* Mobile Order Summary */}
      <div className="pt-4 mb-6 lg:hidden">
        <div className="space-y-2 mb-4">
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
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm" style={{ color: colors.textSecondary }}>
              {language === 'nb' ? 'Frakt' : 'Shipping'}
            </span>
            <span className="text-sm">
              {shippingCost === 0 ? (language === 'nb' ? 'Gratis' : 'Free') : `${shippingCost} kr`}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-gray-200 pt-2">
          <span className="font-medium">
            {language === 'nb' ? 'Total sum' : 'Total'}{' '}
            <span className="text-xs font-normal" style={{ color: colors.textSecondary }}>
              ({language === 'nb' ? 'inkl. mva.' : 'incl. VAT'})
            </span>
          </span>
          <span className="font-medium">{total} kr</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        className="block w-full text-center py-2.5 rounded-[20px] text-xl font-semibold transition-opacity"
        style={{
          backgroundColor: canContinue ? colors.primary : 'white',
          color: canContinue ? 'white' : colors.textDisabled,
          border: canContinue ? 'none' : '1px solid rgba(0,0,0,0.3)',
          cursor: canContinue ? 'pointer' : 'auto',
        }}
        onMouseOver={(e) => canContinue && (e.currentTarget.style.opacity = '0.7')}
        onMouseOut={(e) => canContinue && (e.currentTarget.style.opacity = '1')}
      >
        {language === 'nb' ? 'Til betaling' : 'To payment'}
      </button>
    </CheckoutWizard>
  );
};

export default DeliveryChoiceClient;
