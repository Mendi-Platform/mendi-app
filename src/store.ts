import { create } from "zustand";
import { nanoid } from "nanoid";
import {
  Category,
  FormData,
  Garment,
  Material,
  RepairType,
  ServiceChoices,
  MainCategory,
} from "./types/formData";

// Helper to get enum key from value
function getEnumKey<T extends object>(enumObj: T, value: T[keyof T]): string | undefined {
  return Object.keys(enumObj).find(key => enumObj[key as keyof T] === value);
}

export interface CartItem extends FormData {
  id: string;
}

export interface FormDataStore {
  formData: FormData;
  cart: CartItem[];
  editingId?: string | null;
  updateFormData: (formData: FormData) => void;
  updateFormField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  updateRepairDetails: <K extends keyof FormData["repairDetails"]>(field: K, value: FormData["repairDetails"][K]) => void;
  addToCart: () => void;
  removeFromCart: (id: string) => void;
  resetFormData: () => void;
  setEditingId: (id: string | null) => void;
  clearEditingId: () => void;
}

const initialFormData: FormData = {
  category: Category.None,
  service: ServiceChoices.None,
  repairType: RepairType.None,
  material: Material.None,
  garment: Garment.None,
  mainCategory: MainCategory.None,
  description: "",
  repairDetails: {},
};

const useFormDataStore = create<FormDataStore>((set, get) => ({
  formData: initialFormData,
  cart: [],
  editingId: null,
  updateFormData: (formData: FormData) => {
    const prev = get().formData;
    if (JSON.stringify(prev) === JSON.stringify(formData)) return;
    // Log enum fields as names (for logging only)
    const loggable = { ...formData };
    const repairTypeLabel = getEnumKey(RepairType, formData.repairType);
    const garmentLabel = getEnumKey(Garment, formData.garment);
    const categoryLabel = getEnumKey(Category, formData.category);
    const serviceLabel = getEnumKey(ServiceChoices, formData.service);
    const materialLabel = getEnumKey(Material, formData.material);
    const mainCategoryLabel = getEnumKey(MainCategory, formData.mainCategory);
    console.log("[Zustand] updateFormData:", {
      ...loggable,
      repairType: repairTypeLabel || formData.repairType,
      garment: garmentLabel || formData.garment,
      category: categoryLabel || formData.category,
      service: serviceLabel || formData.service,
      material: materialLabel || formData.material,
      mainCategory: mainCategoryLabel || formData.mainCategory,
    });
    set({ formData });
    console.log("[Zustand] formData after updateFormData:", {
      ...loggable,
      repairType: repairTypeLabel || formData.repairType,
      garment: garmentLabel || formData.garment,
      category: categoryLabel || formData.category,
      service: serviceLabel || formData.service,
      material: materialLabel || formData.material,
      mainCategory: mainCategoryLabel || formData.mainCategory,
    });
  },
  updateFormField: (field, value) => {
    const prev = get().formData[field];
    if (prev === value) return;
    // Only use string for logging, not for assignment
    const logValue: unknown = (() => {
      switch (field) {
        case "repairType":
          return typeof value === "number" ? getEnumKey(RepairType, value as RepairType) || value : value;
        case "garment":
          return typeof value === "number" ? getEnumKey(Garment, value as Garment) || value : value;
        case "category":
          return typeof value === "number" ? getEnumKey(Category, value as Category) || value : value;
        case "service":
          return typeof value === "number" ? getEnumKey(ServiceChoices, value as ServiceChoices) || value : value;
        case "material":
          return typeof value === "number" ? getEnumKey(Material, value as Material) || value : value;
        case "mainCategory":
          return typeof value === "number" ? getEnumKey(MainCategory, value as MainCategory) || value : value;
        default:
          return value;
      }
    })();

    console.log(`[Zustand] updateFormField: ${field} =`, logValue);
    set((state) => {
      const newState = { ...state.formData, [field]: value };
      console.log("[Zustand] formData after update:", newState);
      return { formData: newState };
    });
  },
  updateRepairDetails: (field, value) => {
    const prev = get().formData.repairDetails?.[field];
    if (prev === value) return;
    const logValue = value;
    // If you have enums in repairDetails, add them here
    console.log(`[Zustand] updateRepairDetails: ${field} =`, logValue);
    set((state) => {
      const newRepairDetails = { ...state.formData.repairDetails, [field]: value };
      const newState = { ...state.formData, repairDetails: newRepairDetails };
      console.log("[Zustand] formData after repairDetails update:", newState);
      return { formData: newState };
    });
  },
  addToCart: () => {
    const { editingId, formData, cart } = get();
    if (editingId) {
      // Update existing item
      const updatedCart = cart.map(item =>
        item.id === editingId ? { ...formData, id: editingId } : item
      );
      set({ cart: updatedCart, formData: initialFormData, editingId: null });
    } else {
      const newItem = { ...formData, id: nanoid() };
      set((state) => ({
        cart: [...state.cart, newItem],
        formData: initialFormData,
      }));
    }
  },
  removeFromCart: (id) => {
    console.log("[Zustand] removeFromCart:", id);
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== id);
      console.log("[Zustand] cart after remove:", newCart);
      return { cart: newCart };
    });
  },
  resetFormData: () => {
    console.log("[Zustand] resetFormData");
    set({ formData: initialFormData });
    console.log("[Zustand] formData after reset:", initialFormData);
  },
  setEditingId: (id) => set({ editingId: id }),
  clearEditingId: () => set({ editingId: null }),
}));

export default useFormDataStore;
