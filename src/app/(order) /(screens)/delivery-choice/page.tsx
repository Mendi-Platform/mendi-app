"use client";

import ExpandableButtonOption from "@/components/ui/expandableButtonOption";
import ButtonWithTextInput from "@/components/ui/buttonWithTextInput";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import postenLogo from "@/app/assets/icons/posten-logo.svg";
import useFormDataStore from "@/store";
import { getRepairTypeLabel, getGarmentLabel } from "@/utils/enumLabels";
import CheckoutWizard from "@/components/checkout/CheckoutWizard";
import {
  DeliveryType,
  STORE_LOCATIONS,
  POSTEN_OPTIONS,
  getShippingCost,
} from "@/constants/delivery";
import { DELIVERY_STEPS, getStepLabels } from "@/constants/steps";
import { SHIPPING_PRICES, REPAIR_PRICES } from "@/constants/prices";
import { COLORS } from "@/constants/colors";

const DeliveryChoicePage = () => {
  const router = useRouter();
  const { cart } = useFormDataStore();
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType>(DeliveryType.None);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [storeSelected, setStoreSelected] = useState<boolean>(false);
  const [selectedPosten, setSelectedPosten] = useState<string>("");
  const [postenSelected, setPostenSelected] = useState<boolean>(false);
  const [syerInput, setSyerInput] = useState("");
  const [syerSubmitted, setSyerSubmitted] = useState(false);

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
    console.log('Saved delivery state:', deliveryState);
  }, [selectedDelivery, selectedStore, storeSelected, selectedPosten, postenSelected, syerInput, syerSubmitted]);

  // Static cart item (same as in cart page)
  const staticCartItem = {
    id: "static-1",
    repairType: 1, // RepairType.Hemming
    garment: 1, // Garment.UpperBody
    category: 2, // Category.Standard
    price: REPAIR_PRICES.STATIC_ITEM,
  };

  const onChoice = (value: DeliveryType) => {
    // Toggle behavior - if clicking on already selected delivery, deselect it
    if (selectedDelivery === value) {
      setSelectedDelivery(DeliveryType.None);
      // Reset all states when deselecting
      setSelectedStore(""); 
      setStoreSelected(false);
      setSelectedPosten("");
      setPostenSelected(false);
      setSyerSubmitted(false);
      setSyerInput("");
    } else {
      setSelectedDelivery(value);
      
      // Reset other states when switching
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
    router.push("/order/payment");
  };

  const handleStoreSelection = () => {
    setStoreSelected(true);
  };

  const handleEditStore = () => {
    setStoreSelected(false);
  };

  const handleDeleteStore = () => {
    setSelectedDelivery(DeliveryType.None);
    setSelectedStore("");
    setStoreSelected(false);
  };

  const handleDropoffClick = () => {
    // Toggle behavior for drop-off
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
    // Toggle behavior for Posten
    if (selectedDelivery === DeliveryType.Posten) {
      setSelectedDelivery(DeliveryType.None);
      setSelectedPosten("");
      setPostenSelected(false);
    } else {
      onChoice(DeliveryType.Posten);
    }
  };

  const handlePostenSelection = () => {
    setPostenSelected(true);
  };

  const handleEditPosten = () => {
    setPostenSelected(false);
  };

  const handleDeletePosten = () => {
    setSelectedDelivery(DeliveryType.None);
    setSelectedPosten("");
    setPostenSelected(false);
  };

  const handleSyerInputChange = (value: string) => {
    setSyerInput(value);
  };

  const handleSyerInputSubmit = (value: string) => {
    setSyerInput(value);
    setSyerSubmitted(true);
  };

  const handleSyerEdit = () => {
    setSyerSubmitted(false);
  };

  const handleSyerDelete = () => {
    setSelectedDelivery(DeliveryType.None);
    setSyerSubmitted(false);
    setSyerInput("");
  };

  const steps = getStepLabels(DELIVERY_STEPS);
  const currentStep = 2;

  // Calculate totals
  const allItems = [staticCartItem, ...cart];
  const subtotal = allItems.reduce((sum, item) => sum + (item.price || 0), 0);

  // Calculate shipping cost using constants
  const calculateShippingCost = () => {
    if (selectedDelivery === DeliveryType.Posten && selectedPosten && postenSelected) {
      return getShippingCost(selectedDelivery, selectedPosten);
    }
    return getShippingCost(selectedDelivery);
  };

  const shippingCost = calculateShippingCost();
  const total = subtotal + shippingCost;

  const canContinue = selectedDelivery !== DeliveryType.None && 
    (selectedDelivery !== DeliveryType.PickupPoint || (selectedStore !== "" && storeSelected)) &&
    (selectedDelivery !== DeliveryType.Posten || (selectedPosten !== "" && postenSelected)) &&
    (selectedDelivery !== DeliveryType.Syer || syerSubmitted);

  return (
    <CheckoutWizard
      steps={steps}
      currentStep={currentStep}
      showSummary={true}
      shippingCost={selectedDelivery !== DeliveryType.None ? shippingCost : undefined}
      shippingLabel="Frakt"
    >
      <h1 className="font-medium text-lg mb-8">Velg leveringsmåte</h1>

      <div className="flex flex-col gap-4 mb-8">
        {/* Drop-off i butikk - ExpandableButtonOption */}
        <ExpandableButtonOption
          label="Drop-off i butikk"
          price="Gratis"
          active={selectedDelivery === DeliveryType.PickupPoint}
          collapsed={storeSelected}
          options={STORE_LOCATIONS}
          selectedOption={selectedStore}
          onMainClick={handleDropoffClick}
          onOptionSelect={setSelectedStore}
          onConfirm={handleStoreSelection}
          onEdit={handleEditStore}
          onDelete={handleDeleteStore}
        />

        <ButtonWithTextInput
          label="Møt syer"
          subText="Møt din lokale skredder på et sentralt sted. Du blir kontaktet, og all kommunikasjon skjer via meldinger."
          price={SHIPPING_PRICES.MEET_TAILOR}
          inputLabel="Forslag til møtested"
          active={selectedDelivery === DeliveryType.Syer}
          submitted={syerSubmitted}
          inputValue={syerInput}
          inputPlaceholder="Ved tigeren på Oslo S"
          onMainClick={handleSyerClick}
          onInputChange={handleSyerInputChange}
          onInputSubmit={handleSyerInputSubmit}
          onEdit={handleSyerEdit}
          onDelete={handleSyerDelete}
        />

        {/* Posten - ExpandableButtonOption */}
        <ExpandableButtonOption
          label=""
          price={`Fra ${SHIPPING_PRICES.POSTEN_SMALL} kr`}
          logo={postenLogo}
          active={selectedDelivery === DeliveryType.Posten}
          collapsed={postenSelected}
          options={POSTEN_OPTIONS}
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
        {/* List all services */}
        <div className="space-y-2 mb-4">
          {allItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm" style={{ color: COLORS.textSecondary }}>
                {getRepairTypeLabel(item.repairType)} - {getGarmentLabel(item.garment)}
              </span>
              <span className="text-sm">{item.price} kr</span>
            </div>
          ))}
        </div>

        {/* Shipping line */}
        {selectedDelivery !== DeliveryType.None && (
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm" style={{ color: COLORS.textSecondary }}>Frakt</span>
            <span className="text-sm">
              {shippingCost === 0 ? "Gratis" : `${shippingCost} kr`}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-2">
          <span className="font-medium">
            Total sum <span className="text-xs font-normal" style={{ color: COLORS.textSecondary }}>(inkl. mva.)</span>
          </span>
          <span className="font-medium">{total} kr</span>
        </div>
      </div>

      {/* Continue button */}
      <button
        type="button"
        onClick={handleContinue}
        disabled={!canContinue}
        className="block w-full text-center py-2.5 rounded-[20px] text-xl font-semibold transition-opacity"
        style={{
          backgroundColor: canContinue ? COLORS.primary : 'white',
          color: canContinue ? 'white' : COLORS.textDisabled,
          border: canContinue ? 'none' : '1px solid rgba(0,0,0,0.3)',
          cursor: canContinue ? 'pointer' : 'auto',
          opacity: canContinue ? 1 : 1,
        }}
        onMouseOver={(e) => canContinue && (e.currentTarget.style.opacity = '0.7')}
        onMouseOut={(e) => canContinue && (e.currentTarget.style.opacity = '1')}
      >
        Til betaling
      </button>
    </CheckoutWizard>
  );
};

export default DeliveryChoicePage; 