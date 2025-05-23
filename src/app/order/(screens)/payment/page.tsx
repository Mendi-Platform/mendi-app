"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useFormDataStore from "@/store";
import Stepper from "@/components/ui/stepper";
import CategoryCard from "@/components/ui/categoryCard";
import ButtonWithTextInput from "@/components/ui/buttonWithTextInput";
import ExpandableButtonOption from "@/components/ui/expandableButtonOption";
import { Garment, Material, RepairType, Category, ServiceChoices, MainCategory, FormData } from "@/types/formData";
import sweater from "@/app/assets/icons/sweater.png";
import pants from "@/app/assets/icons/pants.png";
import dress from "@/app/assets/icons/dress.png";
import suit from "@/app/assets/icons/suit.png";
import frakk from "@/app/assets/icons/frakk.png";
import leather from "@/app/assets/icons/leather.svg";
import curtains from "@/app/assets/icons/curtain.svg";
import postenLogo from "@/app/assets/icons/posten-logo.svg";
import { getRepairTypeLabel, getGarmentLabel } from "@/utils/enumLabels";

// Same enums and data as delivery-choice
enum DeliveryType {
  None = "",
  Syer = "syer",
  PickupPoint = "pickup_point", 
  Posten = "posten",
}

const storeOptions = [
  {
    id: "grunerløkka",
    name: "Grünerløkka, Oslo",
    address: "Raw Denim & Vintage Jeans",
    price: 0,
    logo: postenLogo,
  },
  {
    id: "grunerløkka-xaki",
    name: "Grünerløkka, Oslo", 
    address: "XAKI",
    price: 0,
    logo: postenLogo,
  },
  {
    id: "uio",
    name: "UiO, Oslo",
    address: "Forskningsparken",
    price: 0,
    logo: postenLogo,
  },
  {
    id: "sentrum",
    name: "Sentrum, Bergen",
    address: "The Second Hand",
    price: 0,
    logo: postenLogo,
  }
];

const postenOptions = [
  {
    id: "lite-0-5kg",
    name: "Lite 0-5 kg",
    address: "Oppti 35 x 23 x 5 cm, tur + retur",
    price: 158,
    logo: postenLogo,
  },
  {
    id: "stor-0-10kg",
    name: "Stor 0-10 kg", 
    address: "Oppti 35 x 23 x 15 cm, tur + retur",
    price: 198,
    logo: postenLogo,
  }
];

// Helper to get logo based on garment type (same as cart)
const getLogo = (garment: number) => {
  switch (garment) {
    case Garment.UpperBody:
      return sweater;
    case Garment.LowerBody:
      return pants;
    case Garment.Kjole:
      return dress;
    case Garment.Dress:
      return suit;
    case Garment.OuterWear:
      return frakk;
    case Garment.LeatherItems:
      return leather;
    case Garment.Curtains:
      return curtains;
    default:
      return sweater;
  }
};

const PaymentPage = () => {
  const router = useRouter();
  const { cart } = useFormDataStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Delivery state - same as delivery-choice
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

  // Debug state
  const [debugInfo, setDebugInfo] = useState("");

  // Add state to track if delivery component is expanded on payment page
  const [deliveryExpanded, setDeliveryExpanded] = useState(false);

  // Static cart item (same as previous pages)
  const staticCartItem = {
    id: "static-1",
    title: "Statisk vare", 
    logo: sweater,
    price: 199,
    formData: {
      category: Category.Standard,
      service: ServiceChoices.Repair,
      repairType: RepairType.Hemming,
      material: Material.Normal,
      garment: Garment.UpperBody,
      mainCategory: MainCategory.Clothes,
      description: "Dette er en statisk vare.",
      repairDetails: {},
      price: 199,
    } as FormData,
  };

  // Load delivery state from localStorage on mount - ONLY READ, NO WRITE
  useEffect(() => {
    const savedDeliveryState = localStorage.getItem('deliveryState');
    console.log('Raw localStorage data:', savedDeliveryState);
    
    if (savedDeliveryState) {
      try {
        const parsed = JSON.parse(savedDeliveryState);
        console.log('Parsed delivery state:', parsed);
        
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

  // Combine static and dynamic cart items (same as cart page)
  const allCartItems = [
    staticCartItem,
    ...cart.map(item => ({
      ...item,
      title:
        item.repairType && item.garment
          ? `${getRepairTypeLabel(item.repairType)}\n${getGarmentLabel(item.garment)}\n${item.category === 2 ? "Standard" : item.category === 1 ? "Premium" : ""}`
          : item.description || "Dynamisk vare",
      logo: getLogo(item.garment),
      formData: item,
      price: item.price || 0,
      id: typeof item.id === "string" ? item.id : String(item.id),
    })),
  ];

  const steps = ["Adresse", "Levering", "Betaling"];
  const currentStep = 3;

  // Same delivery handlers as delivery-choice - but also update localStorage when changes happen
  const onChoice = (value: DeliveryType) => {
    if (selectedDelivery === value) {
      setSelectedDelivery(DeliveryType.None);
    } else {
      setSelectedDelivery(value);
    }
    // Update localStorage when user makes changes
    updateLocalStorage({ selectedDelivery: value });
  };

  // Helper function to update localStorage
  const updateLocalStorage = (updates: any) => {
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

  // Simple toggle handlers like cart page
  const handleDropoffClick = () => {
    setDeliveryExpanded(!deliveryExpanded);
  };

  const handleSyerClick = () => {
    setDeliveryExpanded(!deliveryExpanded);
  };

  const handlePostenClick = () => {
    setDeliveryExpanded(!deliveryExpanded);
  };

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
    updateLocalStorage({ 
      selectedDelivery: DeliveryType.None, 
      selectedStore: "", 
      storeSelected: false 
    });
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
    updateLocalStorage({ 
      selectedDelivery: DeliveryType.None, 
      selectedPosten: "", 
      postenSelected: false 
    });
  };

  // Syer handlers - THESE MUST BE DEFINED
  const handleSyerInputChange = (value: string) => {
    setSyerInput(value);
  };

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
    updateLocalStorage({ 
      selectedDelivery: DeliveryType.None, 
      syerSubmitted: false, 
      syerInput: "" 
    });
  };

  // Coupon handlers
  const handleCouponClick = () => {
    setCouponActive(!couponActive);
  };

  const handleCouponInputChange = (value: string) => {
    setCouponInput(value);
  };

  const handleCouponSubmit = (value: string) => {
    setCouponInput(value);
    setCouponSubmitted(true);
  };

  const handleCouponEdit = () => {
    setCouponSubmitted(false);
  };

  const handleCouponDelete = () => {
    setCouponActive(false);
    setCouponSubmitted(false);
    setCouponInput("");
  };

  // Calculate totals (same as delivery-choice)
  const subtotal = allCartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  
  const getShippingCost = () => {
    switch (selectedDelivery) {
      case DeliveryType.PickupPoint:
        return 0;
      case DeliveryType.Syer:
        return 99;
      case DeliveryType.Posten:
        if (selectedPosten && postenSelected) {
          const selected = postenOptions.find(opt => opt.id === selectedPosten);
          return selected ? selected.price : 158;
        }
        return 158;
      default:
        return 0;
    }
  };

  const shippingCost = getShippingCost();
  const total = subtotal + shippingCost;

  const handlePayment = () => {
    // Navigate to confirmation or success page
    router.push("/order/confirmation");
  };

  return (
    <div 
      className="w-full h-screen overflow-y-auto"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
    >
      <div className="w-full max-w-md mx-auto px-4 py-8">
        <div className="mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>
        
        <h1 className="font-medium text-lg mb-2">Betaling</h1>
        <p className="text-sm text-[#797979] mb-8">
          Bestill en ordre og betal - enkelt og smidig!
        </p>

        {/* Debug info - remove this later */}
        <div className="mb-4 p-2 bg-gray-100 text-xs">
          Debug: {debugInfo} | Current delivery: {selectedDelivery}
        </div>

        {/* Service Details - Same CategoryCard components as cart */}
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

        {/* Delivery Options - Show only the selected delivery method */}
        <div className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Drop-off i butikk - Only show if selected */}
            {selectedDelivery === DeliveryType.PickupPoint && (
              <ExpandableButtonOption
                label="Drop-off i butikk"
                price="Gratis"
                active={deliveryExpanded}  // Simple toggle like cart
                collapsed={storeSelected}
                options={storeOptions}
                selectedOption={selectedStore}
                onMainClick={handleDropoffClick}
                onOptionSelect={setSelectedStore}
                onConfirm={handleStoreSelection}
                onEdit={handleEditStore}
                onDelete={handleDeleteStore}
              />
            )}

            {/* Møt syer - Only show if selected */}
            {selectedDelivery === DeliveryType.Syer && (
              <ButtonWithTextInput
                label="Møt syer"
                subText="Møt din lokale skredder på et sentralt sted. Du blir kontaktet, og all kommunikasjon skjer via meldinger."
                price={99}
                inputLabel="Forslag til møtested"
                active={deliveryExpanded}  // Simple toggle like cart
                submitted={syerSubmitted}
                inputValue={syerInput}
                inputPlaceholder="Ved tigeren på Oslo S"
                onMainClick={handleSyerClick}
                onInputChange={handleSyerInputChange}
                onInputSubmit={handleSyerInputSubmit}
                onEdit={handleSyerEdit}
                onDelete={handleSyerDelete}
              />
            )}

            {/* Posten - Only show if selected */}
            {selectedDelivery === DeliveryType.Posten && (
              <ExpandableButtonOption
                label=""
                price="Fra 158 kr"
                logo={postenLogo}
                active={deliveryExpanded}  // Simple toggle like cart
                collapsed={postenSelected}
                options={postenOptions}
                selectedOption={selectedPosten}
                onMainClick={handlePostenClick}
                onOptionSelect={setSelectedPosten}
                onConfirm={handlePostenSelection}
                onEdit={handleEditPosten}
                onDelete={handleDeletePosten}
              />
            )}

            {/* Fallback message if no delivery method selected */}
            {selectedDelivery === DeliveryType.None && (
              <div className="p-4 border border-gray-200 rounded-lg text-center text-gray-500">
                Ingen leveringsmetode valgt
              </div>
            )}
          </div>
        </div>

        {/* Gavekort eller rabattkode */}
        <div className="mb-6">
          <ButtonWithTextInput
            label="Gavekort eller rabattkode"
            active={couponActive}
            submitted={couponSubmitted}
            inputValue={couponInput}
            inputPlaceholder="COUPON"
            inputLabel="Lov inn din rabattkode her."
            onMainClick={handleCouponClick}
            onInputChange={handleCouponInputChange}
            onInputSubmit={handleCouponSubmit}
            onEdit={handleCouponEdit}
            onDelete={handleCouponDelete}
          />
        </div>

        {/* Order Summary - Same as delivery-choice */}
        <div className="mb-6">
          <div className="space-y-2 mb-4">
            {allCartItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">
                  {getRepairTypeLabel(item.formData.repairType)} - {getGarmentLabel(item.formData.garment)}
                </span>
                <span className="text-sm">{item.price} kr</span>
              </div>
            ))}
          </div>
          
          {/* Shipping line */}
          {selectedDelivery !== DeliveryType.None && (
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">Frakt</span>
              <span className="text-sm">
                {shippingCost === 0 ? "Gratis" : `${shippingCost} kr`}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center border-t border-gray-200 pt-2">
            <span className="font-medium">Total sum <span className="text-xs font-normal text-[#797979]">(inkl. mva.)</span></span>
            <span className="font-medium">{total} kr</span>
          </div>
        </div>
        
        {/* Payment Button */}
        <button
          type="button"
          onClick={handlePayment}
          className="block w-full text-center py-3 rounded-[20px] text-xl font-semibold bg-[#FF6B35] text-white hover:opacity-70"
        >
          Betal med Vipps
        </button>
      </div>
    </div>
  );
};

export default PaymentPage; 