"use client";

import CategoryCard from "@/components/ui/categoryCard";
import Button from "@/components/ui/button";
import { useState } from "react";
import { Garment, Material, RepairType, Category, ServiceChoices, MainCategory, FormData } from "@/types/formData";
import sweater from "@/app/assets/icons/sweater.png";
import pants from "@/app/assets/icons/pants.png";
import dress from "@/app/assets/icons/dress.png";
import frakk from "@/app/assets/icons/frakk.png";
import leather from "@/app/assets/icons/leather.svg";
import curtains from "@/app/assets/icons/curtain.svg";
import AddButton from "@/components/ui/add-button";
import useFormDataStore from "@/store";
import { useRouter } from "next/navigation";
import React from "react";
import { useToast } from "@/components/ui/toast";
import { getRepairTypeLabel, getGarmentLabel } from "@/utils/enumLabels";

// Static cart item
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

// Helper to get logo based on garment type
const getLogo = (garment: number) => {
  switch (garment) {
    case Garment.UpperBody:
      return sweater;
    case Garment.LowerBody:
      return pants;
    case Garment.DressAndSuit:
      return dress;
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

const CartPage = () => {
  const { cart, removeFromCart, updateFormData, setEditingId } = useFormDataStore();
  const { showToast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();

  // Combine static and dynamic cart items, normalizing shape
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
  console.log("[CartPage] allCartItems:", allCartItems);

  const handleEdit = (id: string) => {
    const item = cart.find((item) => item.id === id);
    if (!item) return;
    updateFormData(item);
    setEditingId(id);
    router.push("/order/garment");
  };

  const handleDelete = (id: string) => {
    console.log('Attempting to delete item with id:', id);
    console.log('Cart before delete:', cart);
    if (id === "static-1") return;
    removeFromCart(id);
    setTimeout(() => {
      // Log after state update
      console.log('Cart after delete:', useFormDataStore.getState().cart);
    }, 100);
    showToast("Varen ble fjernet fra handlekurven");
  };

  const subtotal = allCartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="font-medium text-lg mb-1">Handlekurv ({allCartItems.length})</h1>
      <p className="mb-6 text-sm font-normal text-[#797979]">
        Legg til andre tjenester i bestillingen eller fortsett til kassen.
      </p>
      <div className="flex flex-col gap-4 mb-4">
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
        label="Legg til plagg eller tjeneste"
        onClick={() => router.push("/order/garment")}
        className="mb-6"
      />
      <div className="flex justify-between items-center border-t-2 border-[#242424] pt-4 mb-6">
        <span className="text-base font-bold text-[#242424]">Subtotal <span className="text-xs font-normal text-[#797979]">inkl.mva.</span></span>
        <span className="text-base font-medium">{subtotal} kr</span>
      </div>
      <Button label="Til kassen" link="/order/checkout" />
    </div>
  );
};

export default CartPage; 