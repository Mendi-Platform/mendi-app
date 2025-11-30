"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ChevronDown, ChevronUp, Check, Home, Building2, MapPin, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { createOrder, type CartItemWithMeta } from "@/lib/orders";
import { DeliveryType } from "@/constants/delivery";
import ExpandableButtonOption from "@/components/ui/expandableButtonOption";
import ButtonWithTextInput from "@/components/ui/buttonWithTextInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  SanityStoreLocation,
  SanityPostenOption,
  SanityDeliveryOption,
  SanityPricing,
  SanitySiteSettings,
  OrderFlowStepExpanded,
  SanityOrderStepGroup,
} from "@/sanity/lib/types";
import { getLocalizedValue } from "@/sanity/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import type { GarmentSlug, FormData } from "@/types/formData";

// Address form schema
const addressFormSchema = z.object({
  streetAddress: z.string().min(1, { message: "Gateadresse er påkrevd." }),
  addressAdditional: z.string().optional(),
  zipCode: z.string().min(4, { message: "Postnummer må være minst 4 siffer." }),
  city: z.string().min(1, { message: "Poststed er påkrevd." }),
  addressType: z.enum(["home", "work", "other"]),
  saveAddress: z.boolean(),
});

type AddressFormData = z.infer<typeof addressFormSchema>;

interface SavedAddress {
  id: string;
  streetAddress: string;
  addressAdditional?: string;
  zipCode: string;
  city: string;
  addressType: "home" | "work" | "other";
  createdAt: number;
}

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

// Helper functions
const getGarmentLabelFromSlug = (slug: GarmentSlug, lang: "nb" | "en"): string => {
  const labels: Record<GarmentSlug, { nb: string; en: string }> = {
    "": { nb: "", en: "" },
    "upper-body": { nb: "Overdel", en: "Upper body" },
    "lower-body": { nb: "Underdel", en: "Lower body" },
    kjole: { nb: "Kjole", en: "Dress" },
    dress: { nb: "Dress", en: "Suit" },
    "outer-wear": { nb: "Jakke/Yttertøy", en: "Jacket/Outerwear" },
    "leather-items": { nb: "Skinnplagg", en: "Leather items" },
    curtains: { nb: "Gardiner", en: "Curtains" },
  };
  return labels[slug]?.[lang] || "";
};

const getRepairTypeLabelFromSlug = (slug: string, lang: "nb" | "en"): string => {
  const labels: Record<string, { nb: string; en: string }> = {
    "": { nb: "", en: "" },
    "replace-zipper": { nb: "Bytte glidelås", en: "Replace zipper" },
    "sew-button": { nb: "Sy på ny knapp", en: "Sew button" },
    hole: { nb: "Hull", en: "Hole" },
    "small-hole": { nb: "Lite hull", en: "Small hole" },
    "big-hole": { nb: "Stort hull", en: "Big hole" },
    "belt-loops": { nb: "Fest på beltehemper", en: "Belt loops" },
    hemming: { nb: "Legge opp", en: "Hemming" },
    "adjust-waist": { nb: "Ta inn i livet", en: "Adjust waist" },
    "other-request": { nb: "Annen forespørsel", en: "Other request" },
  };
  return labels[slug]?.[lang] || "";
};

const getAddressTypeLabel = (type: "home" | "work" | "other", lang: "nb" | "en") => {
  const labels = {
    home: { nb: "Hjemme", en: "Home" },
    work: { nb: "Jobb", en: "Work" },
    other: { nb: "Annet", en: "Other" },
  };
  return labels[type][lang];
};

type CheckoutSectionType = "address" | "delivery" | "payment";

export default function CheckoutSection({
  storeLocations,
  postenOptions,
  deliveryOptions,
  pricing,
  siteSettings: _siteSettings,
  orderFlowConfig: _orderFlowConfig,
}: CheckoutSectionProps) {
  const { language } = useLanguage();
  const { cart } = useCart();

  // Section state
  const [activeSection, setActiveSection] = useState<CheckoutSectionType>("address");
  const [addressCompleted, setAddressCompleted] = useState(false);
  const [deliveryCompleted, setDeliveryCompleted] = useState(false);

  // Address state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Delivery state
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryType>(DeliveryType.None);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [storeSelected, setStoreSelected] = useState<boolean>(false);
  const [selectedPosten, setSelectedPosten] = useState<string>("");
  const [postenSelected, setPostenSelected] = useState<boolean>(false);
  const [syerInput, setSyerInput] = useState("");
  const [syerSubmitted, setSyerSubmitted] = useState(false);

  // Payment state
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      streetAddress: "",
      addressAdditional: "",
      zipCode: "",
      city: "",
      addressType: "home",
      saveAddress: false,
    },
  });

  // Get delivery options from Sanity
  const pickupOption = deliveryOptions.find((o) => o.type === "pickup_point");
  const syerOption = deliveryOptions.find((o) => o.type === "syer");
  const postenDeliveryOption = deliveryOptions.find((o) => o.type === "posten");

  // Transform store locations
  const storeOptionsFormatted = storeLocations.map((store) => ({
    id: store._id,
    name: store.name,
    subText: store.address,
    price: store.price,
  }));

  // Transform posten options
  const postenOptionsFormatted = postenOptions.map((opt) => ({
    id: opt._id,
    name: getLocalizedValue(opt.name, language),
    subText: getLocalizedValue(opt.description, language),
    price: opt.price,
  }));

  // Static item price from Sanity
  const staticItemPrice = pricing?.staticItemPrice || 199;

  // Static cart item
  const staticCartItem = {
    id: "static-1",
    title: language === "nb" ? "Statisk vare" : "Static item",
    price: staticItemPrice,
    formData: {
      categorySlug: "standard",
      serviceSlug: "repair",
      repairTypeSlug: "hemming",
      materialSlug: "normal",
      garmentSlug: "upper-body",
      mainCategorySlug: "clothes",
      description: "",
      repairDetails: {},
      price: staticItemPrice,
    } as FormData,
  };

  // All cart items
  const allCartItems = [
    staticCartItem,
    ...cart.map((item) => ({
      ...item,
      title: `${getRepairTypeLabelFromSlug(item.repairTypeSlug, language)}${item.garmentSlug ? ` - ${getGarmentLabelFromSlug(item.garmentSlug, language)}` : ""}`,
      formData: item,
      price: item.price || 0,
      id: typeof item.id === "string" ? item.id : String(item.id),
    })),
  ];

  // Load saved data from localStorage
  useEffect(() => {
    // Load addresses
    const addresses = localStorage.getItem("savedAddresses");
    if (addresses) {
      const parsedAddresses: SavedAddress[] = JSON.parse(addresses);
      const sortedAddresses = parsedAddresses.sort((a, b) => b.createdAt - a.createdAt);
      setSavedAddresses(sortedAddresses);

      const selectedAddress = localStorage.getItem("selectedDeliveryAddress");
      if (selectedAddress) {
        const parsed = JSON.parse(selectedAddress);
        setSelectedAddressId(parsed.id);
        setAddressCompleted(true);
        setActiveSection("delivery");
      } else if (sortedAddresses.length > 0) {
        setSelectedAddressId(sortedAddresses[0].id);
      } else {
        setShowAddressForm(true);
      }
    } else {
      setShowAddressForm(true);
    }

    // Load delivery state
    const savedDeliveryState = localStorage.getItem("deliveryState");
    if (savedDeliveryState) {
      const parsed = JSON.parse(savedDeliveryState);
      setSelectedDelivery(parsed.selectedDelivery || DeliveryType.None);
      setSelectedStore(parsed.selectedStore || "");
      setStoreSelected(parsed.storeSelected || false);
      setSelectedPosten(parsed.selectedPosten || "");
      setPostenSelected(parsed.postenSelected || false);
      setSyerInput(parsed.syerInput || "");
      setSyerSubmitted(parsed.syerSubmitted || false);

      if (
        parsed.selectedDelivery !== DeliveryType.None &&
        ((parsed.selectedDelivery === DeliveryType.PickupPoint && parsed.storeSelected) ||
          (parsed.selectedDelivery === DeliveryType.Posten && parsed.postenSelected) ||
          (parsed.selectedDelivery === DeliveryType.Syer && parsed.syerSubmitted))
      ) {
        setDeliveryCompleted(true);
      }
    }
  }, []);

  // Save delivery state to localStorage
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
    localStorage.setItem("deliveryState", JSON.stringify(deliveryState));
  }, [selectedDelivery, selectedStore, storeSelected, selectedPosten, postenSelected, syerInput, syerSubmitted]);

  // Calculate shipping cost
  const getShippingCost = () => {
    if (selectedDelivery === DeliveryType.PickupPoint) {
      return pickupOption?.price || 0;
    }
    if (selectedDelivery === DeliveryType.Syer) {
      return syerOption?.price || 99;
    }
    if (selectedDelivery === DeliveryType.Posten && selectedPosten && postenSelected) {
      const selected = postenOptions.find((o) => o._id === selectedPosten);
      return selected?.price || postenDeliveryOption?.price || 158;
    }
    if (selectedDelivery === DeliveryType.Posten) {
      return postenDeliveryOption?.price || 158;
    }
    return 0;
  };

  const subtotal = allCartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const shippingCost = getShippingCost();
  const total = subtotal + shippingCost;
  const minPostenPrice = postenOptions.length > 0 ? Math.min(...postenOptions.map((o) => o.price)) : 158;

  // Form validation
  const streetAddress = form.watch("streetAddress");
  const zipCode = form.watch("zipCode");
  const city = form.watch("city");
  const addressType = form.watch("addressType");
  const isFormValid = streetAddress && zipCode && zipCode.length >= 4 && city && addressType;

  // Delivery validation
  const isDeliveryValid =
    selectedDelivery !== DeliveryType.None &&
    ((selectedDelivery === DeliveryType.PickupPoint && selectedStore !== "" && storeSelected) ||
      (selectedDelivery === DeliveryType.Posten && selectedPosten !== "" && postenSelected) ||
      (selectedDelivery === DeliveryType.Syer && syerSubmitted));

  // Address handlers
  const onAddressSubmit = (values: AddressFormData) => {
    if (editingAddressId) {
      const updatedAddresses = savedAddresses.map((addr) =>
        addr.id === editingAddressId ? { ...addr, ...values, id: editingAddressId } : addr
      );
      setSavedAddresses(updatedAddresses);
      localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
      setEditingAddressId(null);
    } else if (values.saveAddress) {
      const newAddress: SavedAddress = {
        id: Date.now().toString(),
        streetAddress: values.streetAddress,
        addressAdditional: values.addressAdditional,
        zipCode: values.zipCode,
        city: values.city,
        addressType: values.addressType,
        createdAt: Date.now(),
      };
      const updatedAddresses = [newAddress, ...savedAddresses];
      setSavedAddresses(updatedAddresses);
      localStorage.setItem("savedAddresses", JSON.stringify(updatedAddresses));
      setSelectedAddressId(newAddress.id);
      localStorage.setItem("selectedDeliveryAddress", JSON.stringify(newAddress));
    } else {
      const tempAddress: SavedAddress = {
        id: "temp-" + Date.now().toString(),
        streetAddress: values.streetAddress,
        addressAdditional: values.addressAdditional,
        zipCode: values.zipCode,
        city: values.city,
        addressType: values.addressType,
        createdAt: Date.now(),
      };
      localStorage.setItem("selectedDeliveryAddress", JSON.stringify(tempAddress));
    }

    setShowAddressForm(false);
    setAddressCompleted(true);
    setActiveSection("delivery");
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = savedAddresses.find((addr) => addr.id === addressId);
    if (selectedAddress) {
      localStorage.setItem("selectedDeliveryAddress", JSON.stringify(selectedAddress));
    }
  };

  const handleConfirmAddress = () => {
    if (selectedAddressId) {
      setAddressCompleted(true);
      setActiveSection("delivery");
    }
  };

  // Delivery handlers
  const onDeliveryChoice = (value: DeliveryType) => {
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

  const handleConfirmDelivery = () => {
    if (isDeliveryValid) {
      setDeliveryCompleted(true);
      setActiveSection("payment");
    }
  };

  // Payment handler
  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentError(null);

    try {
      const orderItems: CartItemWithMeta[] = allCartItems.map((item) => ({
        ...item.formData,
        id: item.id,
        title: item.title,
      }));

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

      const orderId = await createOrder({
        items: orderItems,
        subtotal,
        shippingCost,
        total,
        deliveryMethod: selectedDelivery,
        deliveryDetails,
      });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          items: orderItems,
          shippingCost,
          total,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError(
        error instanceof Error ? error.message : "Det oppsto en feil. Vennligst prøv igjen."
      );
      setIsLoading(false);
    }
  };

  const canPay = addressCompleted && deliveryCompleted;

  // Labels
  const labels = {
    title: language === "nb" ? "Kasse" : "Checkout",
    address: language === "nb" ? "Leveringsadresse" : "Delivery address",
    delivery: language === "nb" ? "Leveringsmåte" : "Delivery method",
    payment: language === "nb" ? "Betaling" : "Payment",
    orderSummary: language === "nb" ? "Ordresammendrag" : "Order summary",
    subtotal: "Subtotal",
    shipping: language === "nb" ? "Frakt" : "Shipping",
    total: language === "nb" ? "Total" : "Total",
    inclVat: language === "nb" ? "inkl. mva." : "incl. VAT",
    payWithCard: language === "nb" ? "Betal med kort" : "Pay with card",
    processing: language === "nb" ? "Behandler..." : "Processing...",
    continue: language === "nb" ? "Fortsett" : "Continue",
    free: language === "nb" ? "Gratis" : "Free",
    addNewAddress: language === "nb" ? "Legg til ny adresse" : "Add new address",
    addressType: language === "nb" ? "Adressetype" : "Address type",
    streetAddress: language === "nb" ? "Gate og husnummer" : "Street address",
    addressAdditional: language === "nb" ? "Adressetillegg" : "Address line 2",
    optional: language === "nb" ? "valgfritt" : "optional",
    zipCode: language === "nb" ? "Postnummer" : "Zip code",
    city: language === "nb" ? "Sted" : "City",
    saveAddress: language === "nb" ? "Lagre denne adressen for fremtidige bestillinger" : "Save this address for future orders",
    cancel: language === "nb" ? "Avbryt" : "Cancel",
    goBack: language === "nb" ? "Gå tilbake" : "Go back",
  };

  const steps: { key: CheckoutSectionType; label: string; complete: boolean }[] = [
    { key: "address", label: labels.address, complete: addressCompleted },
    { key: "delivery", label: labels.delivery, complete: deliveryCompleted },
    { key: "payment", label: labels.payment, complete: canPay },
  ];
  const currentStepIndex = Math.max(0, steps.findIndex((step) => step.key === activeSection));
  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100;

  const deliveryTitle = (() => {
    if (selectedDelivery === DeliveryType.PickupPoint) {
      return (
        getLocalizedValue(pickupOption?.name, language) ||
        (language === "nb" ? "Drop-off i butikk" : "Drop-off at store")
      );
    }
    if (selectedDelivery === DeliveryType.Posten) {
      return (
        getLocalizedValue(postenDeliveryOption?.name, language) ||
        (language === "nb" ? "Posten" : "Posten")
      );
    }
    if (selectedDelivery === DeliveryType.Syer) {
      return (
        getLocalizedValue(syerOption?.name, language) ||
        (language === "nb" ? "Møt syer" : "Meet tailor")
      );
    }
    return language === "nb" ? "Levering ikke valgt" : "Delivery not selected";
  })();

  const deliverySummaryLine = (() => {
    if (selectedDelivery === DeliveryType.PickupPoint && selectedStore) {
      const store = storeOptionsFormatted.find((option) => option.id === selectedStore);
      return store?.name || deliveryTitle;
    }
    if (selectedDelivery === DeliveryType.Posten && selectedPosten) {
      const posten = postenOptionsFormatted.find((option) => option.id === selectedPosten);
      return posten?.name || deliveryTitle;
    }
    if (selectedDelivery === DeliveryType.Syer && syerInput) {
      return syerInput;
    }
    return language === "nb" ? "Velg leveringsmåte" : "Choose delivery method";
  })();

  const shippingLabel =
    selectedDelivery === DeliveryType.None
      ? language === "nb"
        ? "Legg til leveringsmåte"
        : "Add delivery method"
      : shippingCost === 0
        ? labels.free
        : `${shippingCost} kr`;

  // Selected address display
  const selectedAddress = savedAddresses.find((addr) => addr.id === selectedAddressId);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-text-primary">
            {labels.title}
          </h1>
        </div>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-6 lg:gap-8 items-start">
          <div className="space-y-6">
            {/* Step 1: Address */}
            <div
              className={`bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all border ${
                activeSection === "address" ? "shadow-md border-brand-primary-light/70" : "border-border-default"
              } ${activeSection !== "address" && !addressCompleted ? "opacity-60" : ""}`}
            >
              <button
                type="button"
                onClick={() => setActiveSection("address")}
                className="w-full p-6 md:p-8 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {addressCompleted ? (
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white">
                      <Check size={16} />
                    </span>
                  ) : (
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${
                        activeSection === "address"
                          ? "bg-brand-primary text-white"
                          : "bg-bg-default text-text-secondary border border-border-default"
                      }`}
                    >
                      1
                    </span>
                  )}
                  <h2
                    className={`text-xl font-medium tracking-tight ${
                      activeSection === "address" || addressCompleted ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {labels.address}
                  </h2>
                </div>
                {activeSection === "address" ? (
                  <ChevronUp className="w-5 h-5 text-text-disabled" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-disabled" />
                )}
              </button>

              {activeSection === "address" && (
                <div className="px-6 pb-6 md:px-8 md:pb-8">
                  {/* Address completed summary */}
                  {addressCompleted && selectedAddress && !showAddressForm && (
                    <div className="mb-6 p-4 rounded-lg bg-brand-primary-lighter border border-brand-primary-light">
                      <div className="flex items-center gap-2 mb-1">
                        {selectedAddress.addressType === "home" && <Home size={16} className="text-brand-primary" />}
                        {selectedAddress.addressType === "work" && <Building2 size={16} className="text-brand-primary" />}
                        {selectedAddress.addressType === "other" && <MapPin size={16} className="text-brand-primary" />}
                        <span className="text-sm text-brand-primary font-medium">
                          {getAddressTypeLabel(selectedAddress.addressType, language)}
                        </span>
                      </div>
                      <div className="font-medium text-text-primary">{selectedAddress.streetAddress}</div>
                      {selectedAddress.addressAdditional && (
                        <div className="text-sm text-text-secondary">{selectedAddress.addressAdditional}</div>
                      )}
                      <div className="text-sm text-text-secondary">
                        {selectedAddress.zipCode} {selectedAddress.city}
                      </div>
                    </div>
                  )}

                  {/* Address list */}
                  {!showAddressForm && savedAddresses.length > 0 && (
                    <>
                      <div className="space-y-3 mb-6">
                        {savedAddresses.map((address) => (
                          <div
                            key={address.id}
                            onClick={() => handleAddressSelect(address.id)}
                            className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                              selectedAddressId === address.id
                                ? "border-brand-primary bg-brand-primary-lighter shadow-sm"
                                : "border-border-default bg-white hover:bg-bg-inactive"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {address.addressType === "home" && (
                                <Home size={16} className={selectedAddressId === address.id ? "text-brand-primary" : "text-text-secondary"} />
                              )}
                              {address.addressType === "work" && (
                                <Building2 size={16} className={selectedAddressId === address.id ? "text-brand-primary" : "text-text-secondary"} />
                              )}
                              {address.addressType === "other" && (
                                <MapPin size={16} className={selectedAddressId === address.id ? "text-brand-primary" : "text-text-secondary"} />
                              )}
                              <span className={`text-sm font-medium ${selectedAddressId === address.id ? "text-brand-primary" : "text-text-secondary"}`}>
                                {getAddressTypeLabel(address.addressType, language)}
                              </span>
                            </div>
                            <div className="font-medium text-text-primary">{address.streetAddress}</div>
                            <div className="text-sm text-text-secondary">
                              {address.zipCode} {address.city}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddressForm(true);
                          setEditingAddressId(null);
                          form.reset();
                        }}
                        className="w-full p-4 rounded-lg mb-6 flex items-center justify-center gap-2 border border-border-default bg-white hover:bg-bg-inactive transition-colors"
                      >
                        <span className="text-lg text-brand-primary">+</span>
                        <span className="text-text-primary font-medium">{labels.addNewAddress}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmAddress}
                        disabled={!selectedAddressId}
                        className="w-full py-3.5 px-4 rounded-lg font-medium text-white shadow-sm transition-all focus:ring-4 focus:ring-brand-primary-lighter disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: selectedAddressId ? "var(--color-brand-primary)" : "var(--color-text-disabled)" }}
                      >
                        {labels.continue}
                      </button>
                    </>
                  )}

                  {/* Address form */}
                  {showAddressForm && (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onAddressSubmit)} className="space-y-5">
                        {/* Address Type Selector */}
                        <FormField
                          control={form.control}
                          name="addressType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-text-secondary mb-3">
                                {labels.addressType}
                              </FormLabel>
                              <div className="grid grid-cols-3 gap-3">
                                <label className="cursor-pointer">
                                  <input
                                    type="radio"
                                    className="hidden peer"
                                    checked={field.value === "home"}
                                    onChange={() => field.onChange("home")}
                                  />
                                  <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                                    field.value === "home"
                                      ? "border-brand-primary-light bg-brand-primary-lighter text-brand-primary ring-1 ring-brand-primary"
                                      : "border-border-default bg-white text-text-secondary hover:bg-bg-inactive"
                                  }`}>
                                    <Home size={16} />
                                    <span className="text-sm font-medium">{language === "nb" ? "Hjemme" : "Home"}</span>
                                  </div>
                                </label>
                                <label className="cursor-pointer">
                                  <input
                                    type="radio"
                                    className="hidden peer"
                                    checked={field.value === "work"}
                                    onChange={() => field.onChange("work")}
                                  />
                                  <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                                    field.value === "work"
                                      ? "border-brand-primary-light bg-brand-primary-lighter text-brand-primary ring-1 ring-brand-primary"
                                      : "border-border-default bg-white text-text-secondary hover:bg-bg-inactive"
                                  }`}>
                                    <Building2 size={16} />
                                    <span className="text-sm font-medium">{language === "nb" ? "Jobb" : "Work"}</span>
                                  </div>
                                </label>
                                <label className="cursor-pointer">
                                  <input
                                    type="radio"
                                    className="hidden peer"
                                    checked={field.value === "other"}
                                    onChange={() => field.onChange("other")}
                                  />
                                  <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                                    field.value === "other"
                                      ? "border-brand-primary-light bg-brand-primary-lighter text-brand-primary ring-1 ring-brand-primary"
                                      : "border-border-default bg-white text-text-secondary hover:bg-bg-inactive"
                                  }`}>
                                    <MapPin size={16} />
                                    <span className="text-sm font-medium">{language === "nb" ? "Annet" : "Other"}</span>
                                  </div>
                                </label>
                              </div>
                            </FormItem>
                          )}
                        />

                      <FormField
                        control={form.control}
                        name="streetAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-text-primary mb-2">
                              {labels.streetAddress}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={language === "nb" ? "Storgata 1" : "123 Main St"}
                                className="w-full px-4 py-3 rounded-lg border border-border-default text-base bg-white text-text-primary placeholder:text-text-disabled focus:border-brand-primary focus:ring-4 focus:ring-brand-primary-lighter"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressAdditional"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-text-primary mb-2">
                              {labels.addressAdditional}{" "}
                              <span className="text-text-disabled font-normal">({labels.optional})</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="H0201"
                                className="w-full px-4 py-3 rounded-lg border border-border-default text-base bg-white text-text-primary placeholder:text-text-disabled focus:border-brand-primary focus:ring-4 focus:ring-brand-primary-lighter"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-text-primary mb-2">
                                {labels.zipCode}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="0123"
                                  className="w-full px-4 py-3 rounded-lg border border-border-default text-base bg-white text-text-primary placeholder:text-text-disabled focus:border-brand-primary focus:ring-4 focus:ring-brand-primary-lighter"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-text-primary mb-2">
                                {labels.city}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Oslo"
                                  className="w-full px-4 py-3 rounded-lg border border-border-default text-base bg-white text-text-primary placeholder:text-text-disabled focus:border-brand-primary focus:ring-4 focus:ring-brand-primary-lighter"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {!editingAddressId && (
                        <FormField
                          control={form.control}
                          name="saveAddress"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-3 mt-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!isFormValid}
                                  className="w-5 h-5"
                                />
                              </FormControl>
                              <FormLabel className="text-base text-text-secondary font-normal cursor-pointer select-none">
                                {labels.saveAddress}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      )}

                      <div className="flex gap-3 mt-8">
                        {savedAddresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="flex-1 py-3.5 px-4 rounded-lg font-medium border border-border-default bg-white text-text-primary hover:bg-bg-inactive transition-colors"
                          >
                            {labels.cancel}
                          </button>
                        )}
                        <button
                          type="submit"
                          disabled={!isFormValid}
                          className="flex-1 py-3.5 px-4 rounded-lg font-medium text-white shadow-sm transition-all focus:ring-4 focus:ring-brand-primary-lighter disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: isFormValid ? "var(--color-brand-primary)" : "var(--color-text-disabled)" }}
                        >
                          {labels.continue}
                        </button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            )}
          </div>

            {/* Step 2: Delivery */}
            <div
              className={`bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all border ${
                activeSection === "delivery" ? "shadow-md border-brand-primary-light/70" : "border-border-default"
              } ${!addressCompleted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <button
                type="button"
                onClick={() => addressCompleted && setActiveSection("delivery")}
                className="w-full p-6 md:p-8 flex items-center justify-between"
                disabled={!addressCompleted}
              >
              <div className="flex items-center gap-4">
                {deliveryCompleted ? (
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-primary text-white">
                    <Check size={16} />
                  </span>
                ) : (
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm border ${
                      activeSection === "delivery" && addressCompleted
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "bg-bg-default text-text-secondary border-border-default"
                    }`}
                  >
                    2
                  </span>
                )}
                <h2 className={`text-lg font-medium ${activeSection === "delivery" || deliveryCompleted ? "text-text-primary" : "text-text-secondary"}`}>
                  {labels.delivery}
                </h2>
              </div>
              {activeSection === "delivery" ? (
                <ChevronUp className="w-5 h-5 text-text-disabled" />
              ) : (
                <ChevronDown className="w-5 h-5 text-text-disabled" />
              )}
              </button>

              {activeSection === "delivery" && addressCompleted && (
                <div className="px-6 pb-6 md:px-8 md:pb-8">
                  <div className="flex flex-col gap-3 mb-6">
                    {/* Drop-off */}
                  <ExpandableButtonOption
                    label={
                      getLocalizedValue(pickupOption?.name, language) ||
                      (language === "nb" ? "Drop-off i butikk" : "Drop-off at store")
                    }
                    price={pickupOption?.price === 0 ? labels.free : `${pickupOption?.price} kr`}
                    active={selectedDelivery === DeliveryType.PickupPoint}
                    collapsed={storeSelected}
                    options={storeOptionsFormatted}
                    selectedOption={selectedStore}
                    onMainClick={() => onDeliveryChoice(DeliveryType.PickupPoint)}
                    onOptionSelect={setSelectedStore}
                    onConfirm={() => setStoreSelected(true)}
                    onEdit={() => setStoreSelected(false)}
                    onDelete={() => {
                      setSelectedDelivery(DeliveryType.None);
                      setSelectedStore("");
                      setStoreSelected(false);
                    }}
                  />

                  {/* Meet tailor */}
                  <ButtonWithTextInput
                    label={
                      getLocalizedValue(syerOption?.name, language) ||
                      (language === "nb" ? "Møt syer" : "Meet tailor")
                    }
                    subText={getLocalizedValue(syerOption?.description, language) || ""}
                    price={syerOption?.price || 99}
                    inputLabel={language === "nb" ? "Forslag til møtested" : "Suggested meeting place"}
                    active={selectedDelivery === DeliveryType.Syer}
                    submitted={syerSubmitted}
                    inputValue={syerInput}
                    inputPlaceholder={language === "nb" ? "Ved tigeren på Oslo S" : "At the tiger at Oslo S"}
                    onMainClick={() => onDeliveryChoice(DeliveryType.Syer)}
                    onInputChange={setSyerInput}
                    onInputSubmit={(value) => {
                      setSyerInput(value);
                      setSyerSubmitted(true);
                    }}
                    onEdit={() => setSyerSubmitted(false)}
                    onDelete={() => {
                      setSelectedDelivery(DeliveryType.None);
                      setSyerSubmitted(false);
                      setSyerInput("");
                    }}
                  />

                  {/* Posten */}
                  <ExpandableButtonOption
                    label=""
                    price={`${language === "nb" ? "Fra" : "From"} ${minPostenPrice} kr`}
                    logo={postenDeliveryOption?.logo}
                    active={selectedDelivery === DeliveryType.Posten}
                    collapsed={postenSelected}
                    options={postenOptionsFormatted}
                    selectedOption={selectedPosten}
                    onMainClick={() => onDeliveryChoice(DeliveryType.Posten)}
                    onOptionSelect={setSelectedPosten}
                    onConfirm={() => setPostenSelected(true)}
                    onEdit={() => setPostenSelected(false)}
                    onDelete={() => {
                      setSelectedDelivery(DeliveryType.None);
                      setSelectedPosten("");
                      setPostenSelected(false);
                    }}
                  />
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmDelivery}
                    disabled={!isDeliveryValid}
                    className="w-full py-3.5 px-4 rounded-lg font-medium text-white shadow-sm transition-all focus:ring-4 focus:ring-brand-primary-lighter disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: isDeliveryValid ? "var(--color-brand-primary)" : "var(--color-text-disabled)" }}
                  >
                    {labels.continue}
                  </button>
                </div>
              )}
            </div>

            {/* Step 3: Payment & Summary */}
            <div
              className={`bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden transition-all border ${
                activeSection === "payment" ? "shadow-md border-brand-primary-light/70" : "border-border-default"
              } ${!deliveryCompleted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <button
                type="button"
                onClick={() => deliveryCompleted && setActiveSection("payment")}
                className="w-full p-6 md:p-8 flex items-center justify-between"
                disabled={!deliveryCompleted}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm border ${
                      activeSection === "payment" && deliveryCompleted
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "bg-bg-default text-text-secondary border-border-default"
                    }`}
                  >
                    3
                  </span>
                  <h2 className={`text-lg font-medium ${activeSection === "payment" || canPay ? "text-text-primary" : "text-text-secondary"}`}>
                    {labels.payment}
                  </h2>
                </div>
                {activeSection === "payment" ? (
                  <ChevronUp className="w-5 h-5 text-text-disabled" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-disabled" />
                )}
              </button>

              {activeSection === "payment" && deliveryCompleted && (
                <div className="px-6 pb-6 md:px-8 md:pb-8 space-y-6">
                  <div className="hidden lg:block bg-bg-inactive border border-border-default rounded-lg p-4 text-sm text-text-secondary">
                    {language === "nb"
                      ? "Se over ordresammendraget til høyre og betal når alt ser riktig ut."
                      : "Review the order summary on the right and pay when everything looks good."}
                  </div>

                  <div className="lg:hidden space-y-5">
                    <h3 className="text-lg font-medium tracking-tight text-text-primary">{labels.orderSummary}</h3>

                    <div className="space-y-3 text-base">
                      {allCartItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-start">
                          <span className="text-text-secondary">{item.title}</span>
                          <span className="font-medium text-text-primary">{item.price} kr</span>
                        </div>
                      ))}

                      <div className="flex justify-between items-start">
                        <span className="text-text-secondary">{labels.shipping}</span>
                        <span className="font-medium text-text-primary">
                          {shippingLabel}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-border-default border-dashed" />

                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium text-text-primary">
                        {labels.total}{" "}
                        <span className="text-text-secondary font-normal text-sm ml-1">({labels.inclVat})</span>
                      </span>
                      <span className="text-xl font-semibold tracking-tight text-text-primary">{total} kr</span>
                    </div>

                    {paymentError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {paymentError}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handlePayment}
                      disabled={!canPay || isLoading}
                      className="w-full py-3.5 px-4 rounded-lg font-medium text-white shadow-sm transition-all flex justify-center items-center gap-2 focus:ring-4 focus:ring-brand-primary-lighter disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: canPay && !isLoading ? "var(--color-brand-primary)" : "var(--color-text-disabled)" }}
                    >
                      <CreditCard size={16} />
                      {isLoading ? labels.processing : labels.payWithCard}
                    </button>

                    <p className="text-xs text-text-secondary text-center">
                      {language === "nb" ? "Betalingen håndteres sikkert av Stripe." : "Payment is securely handled by Stripe."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="sticky top-4 space-y-4 hidden lg:block">
            <div className="bg-white border border-border-default rounded-2xl shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-text-secondary">{labels.orderSummary}</p>
                  <p className="text-lg font-semibold text-text-primary mt-1">
                    {language === "nb" ? "Siste sjekk" : "Final review"}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-brand-primary-lighter text-brand-primary text-xs font-medium">
                  {steps[currentStepIndex]?.label}
                </div>
              </div>

              <div className="space-y-3">
                {allCartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-start text-sm">
                    <span className="text-text-secondary pr-4">{item.title}</span>
                    <span className="text-text-primary font-medium">{item.price} kr</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-dashed border-border-default space-y-3 text-sm">
                <div className="flex items-start justify-between">
                  <div className="text-text-secondary">
                    {labels.shipping}
                    <div className="text-[11px] text-text-disabled mt-0.5">{deliveryTitle}</div>
                  </div>
                  <div className="text-text-primary font-medium text-right">
                    {shippingLabel}
                    <div className="text-[11px] text-text-disabled">{deliverySummaryLine}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-base font-semibold text-text-primary">
                    {labels.total} <span className="text-sm font-normal text-text-secondary">({labels.inclVat})</span>
                  </span>
                  <span className="text-xl font-semibold text-text-primary">{total} kr</span>
                </div>
              </div>

              {paymentError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {paymentError}
                </div>
              )}

              <button
                type="button"
                onClick={handlePayment}
                disabled={!canPay || isLoading}
                className="w-full py-3.5 px-4 rounded-lg font-medium text-white shadow-sm transition-all flex justify-center items-center gap-2 focus:ring-4 focus:ring-brand-primary-lighter disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: canPay && !isLoading ? "var(--color-brand-primary)" : "var(--color-text-disabled)" }}
              >
                <CreditCard size={16} />
                {isLoading ? labels.processing : labels.payWithCard}
              </button>

              <p className="text-[11px] text-text-secondary text-center">
                {language === "nb" ? "Betalingen håndteres sikkert av Stripe." : "Payments are securely handled by Stripe."}
              </p>
            </div>

            <div className="bg-brand-primary-lighter/70 border border-brand-primary-light text-brand-primary rounded-2xl p-4">
              <p className="text-sm font-semibold">
                {language === "nb" ? "Hurtig tips" : "Quick tip"}
              </p>
              <p className="text-sm mt-1">
                {language === "nb"
                  ? "Leveringsvalg og møtesteder lagres lokalt slik at du slipper å fylle inn alt på nytt."
                  : "We save delivery choices locally so you can check out even faster next time."}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
