"use client";

import CategoryCard from "@/components/ui/categoryCard";
import { useState } from "react";
import type { FormData, GarmentSlug } from "@/types/formData";
import AddButton from "@/components/ui/add-button";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import type { SanityPricing, SanitySiteSettings, SanityGarment, OrderFlowStepExpanded, SanityOrderStepGroup } from "@/sanity/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderNavigation } from "@/hooks/useOrderNavigation";

interface CartClientProps {
  pricing: SanityPricing | null;
  siteSettings: SanitySiteSettings | null;
  garments: SanityGarment[];
  orderFlowConfig: {
    startStepSlug: string;
    confirmationStepSlug: string;
    allSteps: OrderFlowStepExpanded[];
    stepGroups: SanityOrderStepGroup[];
  } | null;
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

const CartClient = ({
  pricing,
  siteSettings,
  garments,
  orderFlowConfig,
}: CartClientProps) => {
  const { language } = useLanguage();
  const { cart, removeFromCart, updateFormData, setEditingId } = useCart();
  const { showToast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();
  const { navigateToNext } = useOrderNavigation(orderFlowConfig);

  // Get colors from site settings or use defaults
  const colors = {
    textPrimary: siteSettings?.textPrimaryColor || '#242424',
    textSecondary: siteSettings?.textSecondaryColor || '#797979',
  };

  // Static item price from Sanity
  const staticItemPrice = pricing?.staticItemPrice || 199;

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

  const handleEdit = (id: string) => {
    const item = cart.find((item) => item.id === id);
    if (!item) return;
    updateFormData(item);
    setEditingId(id);
    router.push("/order/garment");
  };

  const handleDelete = (id: string) => {
    if (id === "static-1") return;
    removeFromCart(id);
    showToast(language === 'nb' ? 'Varen ble fjernet fra handlekurven' : 'Item was removed from cart');
  };

  const subtotal = allCartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  // i18n labels
  const labels = {
    cartTitle: language === 'nb' ? 'Handlekurv' : 'Cart',
    subtitle: language === 'nb'
      ? 'Legg til andre tjenester i bestillingen eller fortsett til kassen.'
      : 'Add other services to your order or proceed to checkout.',
    addItem: language === 'nb' ? 'Legg til plagg eller tjeneste' : 'Add garment or service',
    subtotal: 'Subtotal',
    inclVat: language === 'nb' ? 'inkl.mva.' : 'incl. VAT',
    toCheckout: language === 'nb' ? 'Til kassen' : 'To checkout',
  };

  return (
    <div className="w-full">
      <h1 className="font-medium text-lg mb-1">{labels.cartTitle} ({allCartItems.length})</h1>
      <p className="mb-6 text-sm font-normal" style={{ color: colors.textSecondary }}>
        {labels.subtitle}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {allCartItems.map(item => (
          <CategoryCard
            key={item.id}
            title={item.title}
            logo={item.logo}
            isActive={activeId === item.id}
            onClick={() => setActiveId(activeId === item.id ? null : item.id)}
            onEdit={() => handleEdit(item.id)}
            onDelete={() => handleDelete(item.id)}
            formData={item.formData}
            variant="cart"
          />
        ))}
      </div>
      <AddButton
        label={labels.addItem}
        onClick={() => router.push("/order/garment")}
        className="mb-6"
      />
      <div
        className="flex justify-between items-center border-t-2 pt-4 mb-6"
        style={{ borderColor: colors.textPrimary }}
      >
        <span className="text-base font-bold" style={{ color: colors.textPrimary }}>
          {labels.subtotal} <span className="text-xs font-normal" style={{ color: colors.textSecondary }}>{labels.inclVat}</span>
        </span>
        <span className="text-base font-medium">{subtotal} kr</span>
      </div>
      <button
        type="button"
        onClick={() => navigateToNext('cart')}
        className="block w-full text-center py-2.5 rounded-[20px] bg-[#006EFF] text-white hover:opacity-70 text-xl font-semibold"
      >
        {labels.toCheckout}
      </button>
    </div>
  );
};

export default CartClient;
