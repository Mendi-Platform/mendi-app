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
  isHydrated: boolean;
  updateFormData: (formData: FormData) => void;
  updateFormField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  updateRepairDetails: <K extends keyof FormData["repairDetails"]>(field: K, value: FormData["repairDetails"][K]) => void;
  addToCart: () => void;
  removeFromCart: (id: string) => void;
  resetFormData: () => void;
  setEditingId: (id: string | null) => void;
  clearEditingId: () => void;
  hydrate: () => void;
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

// Lagre både formData og cart til localStorage
const saveToLocalStorage = (data: { formData: FormData; cart: CartItem[] }) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('mendi-store-data', JSON.stringify(data));
      console.log('Saved to localStorage:', data);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }
};

const loadFromLocalStorage = (): { formData: FormData; cart: CartItem[] } | null => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('mendi-store-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Loaded from localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }
  return null;
};

const useFormDataStore = create<FormDataStore>((set, get) => ({
  formData: initialFormData,
  cart: [],
  editingId: null,
  isHydrated: false,
  
  hydrate: () => {
    console.log('🔄 Hydrating store...');
    const saved = loadFromLocalStorage();
    if (saved) {
      console.log('✅ Found saved data, loading:', saved);
      set({ 
        formData: saved.formData || initialFormData,
        cart: saved.cart || [],
        isHydrated: true 
      });
    } else {
      console.log('❌ No saved data found, using initial data');
      set({ isHydrated: true });
    }
  },
  
  updateFormData: (formData: FormData) => {
    const prev = get().formData;
    if (JSON.stringify(prev) === JSON.stringify(formData)) return;
    
    console.log("[Zustand] updateFormData:", formData);
    set({ formData });
    const state = get();
    saveToLocalStorage({ formData, cart: state.cart });
  },
  
  updateFormField: (field, value) => {
    const prev = get().formData[field];
    if (prev === value) return;

    console.log(`[Zustand] updateFormField: ${field} =`, value);
    set((state) => {
      const newFormData = { ...state.formData, [field]: value };
      saveToLocalStorage({ formData: newFormData, cart: state.cart });
      return { formData: newFormData };
    });
  },
  
  updateRepairDetails: (field, value) => {
    const prev = get().formData.repairDetails?.[field];
    if (prev === value) return;
    
    console.log(`[Zustand] updateRepairDetails: ${field} =`, value);
    set((state) => {
      const newRepairDetails = { ...state.formData.repairDetails, [field]: value };
      const newFormData = { ...state.formData, repairDetails: newRepairDetails };
      saveToLocalStorage({ formData: newFormData, cart: state.cart });
      return { formData: newFormData };
    });
  },
  
  addToCart: () => {
    const { editingId, formData, cart } = get();
    if (editingId) {
      const updatedCart = cart.map(item =>
        item.id === editingId ? { ...formData, id: editingId } : item
      );
      set({ cart: updatedCart, formData: initialFormData, editingId: null });
      saveToLocalStorage({ formData: initialFormData, cart: updatedCart });
    } else {
      const newItem = { ...formData, id: nanoid() };
      const newCart = [...cart, newItem];
      set(() => ({
        cart: newCart,
        formData: initialFormData,
      }));
      saveToLocalStorage({ formData: initialFormData, cart: newCart });
    }
  },
  
  removeFromCart: (id) => {
    console.log("[Zustand] removeFromCart:", id);
    set((state) => {
      const newCart = state.cart.filter((item) => item.id !== id);
      saveToLocalStorage({ formData: state.formData, cart: newCart });
      return { cart: newCart };
    });
  },
  
  resetFormData: () => {
    console.log("[Zustand] resetFormData");
    const state = get();
    set({ formData: initialFormData });
    saveToLocalStorage({ formData: initialFormData, cart: state.cart });
  },
  
  setEditingId: (id) => set({ editingId: id }),
  clearEditingId: () => set({ editingId: null }),
}));

// Auto-hydrate when store is created (client-side only)
if (typeof window !== 'undefined') {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    useFormDataStore.getState().hydrate();
  }, 100);
}

export default useFormDataStore;
