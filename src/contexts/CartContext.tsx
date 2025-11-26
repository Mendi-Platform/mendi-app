"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { nanoid } from "nanoid";
import type {
  FormData,
  GarmentSlug,
  RepairTypeSlug,
  CategorySlug,
  MaterialSlug,
  ServiceSlug,
  MainCategorySlug,
} from "@/types/formData";

// Re-export types for convenience
export type {
  GarmentSlug,
  RepairTypeSlug,
  CategorySlug,
  MaterialSlug,
  ServiceSlug,
  MainCategorySlug,
};

export interface CartItem extends FormData {
  id: string;
}

interface CartState {
  formData: FormData;
  cart: CartItem[];
  editingId: string | null;
  isHydrated: boolean;
}

type CartAction =
  | { type: "SET_FORM_DATA"; payload: FormData }
  | { type: "SET_FORM_FIELD"; field: keyof FormData; value: FormData[keyof FormData] }
  | { type: "SET_REPAIR_DETAIL"; field: keyof FormData["repairDetails"]; value: FormData["repairDetails"][keyof FormData["repairDetails"]] }
  | { type: "ADD_TO_CART" }
  | { type: "REMOVE_FROM_CART"; id: string }
  | { type: "CLEAR_CART" }
  | { type: "RESET_FORM" }
  | { type: "SET_EDITING_ID"; id: string | null }
  | { type: "HYDRATE"; payload: { formData: FormData; cart: CartItem[] } }
  | { type: "SET_HYDRATED" };

const initialFormData: FormData = {
  categorySlug: "",
  serviceSlug: "",
  repairTypeSlug: "",
  materialSlug: "",
  garmentSlug: "",
  mainCategorySlug: "",
  description: "",
  repairDetails: {},
};

const initialState: CartState = {
  formData: initialFormData,
  cart: [],
  editingId: null,
  isHydrated: false,
};

const STORAGE_KEY = "mendi-store-data";

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, formData: action.payload };

    case "SET_FORM_FIELD":
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
      };

    case "SET_REPAIR_DETAIL":
      return {
        ...state,
        formData: {
          ...state.formData,
          repairDetails: {
            ...state.formData.repairDetails,
            [action.field]: action.value,
          },
        },
      };

    case "ADD_TO_CART": {
      if (state.editingId) {
        const updatedCart = state.cart.map((item) =>
          item.id === state.editingId
            ? { ...state.formData, id: state.editingId }
            : item
        );
        return {
          ...state,
          cart: updatedCart,
          formData: initialFormData,
          editingId: null,
        };
      } else {
        const newItem: CartItem = { ...state.formData, id: nanoid() };
        return {
          ...state,
          cart: [...state.cart, newItem],
          formData: initialFormData,
        };
      }
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.id),
      };

    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
        formData: initialFormData,
        editingId: null,
      };

    case "RESET_FORM":
      return { ...state, formData: initialFormData };

    case "SET_EDITING_ID":
      return { ...state, editingId: action.id };

    case "HYDRATE":
      return {
        ...state,
        formData: action.payload.formData || initialFormData,
        cart: action.payload.cart || [],
        isHydrated: true,
      };

    case "SET_HYDRATED":
      return { ...state, isHydrated: true };

    default:
      return state;
  }
}

interface CartContextValue {
  formData: FormData;
  cart: CartItem[];
  editingId: string | null;
  isHydrated: boolean;
  updateFormData: (formData: FormData) => void;
  updateFormField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  updateRepairDetails: <K extends keyof FormData["repairDetails"]>(
    field: K,
    value: FormData["repairDetails"][K]
  ) => void;
  addToCart: () => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  resetFormData: () => void;
  setEditingId: (id: string | null) => void;
  clearEditingId: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist to localStorage whenever cart or formData changes
  useEffect(() => {
    if (state.isHydrated) {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ formData: state.formData, cart: state.cart })
        );
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    }
  }, [state.formData, state.cart, state.isHydrated]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: "HYDRATE", payload: parsed });
      } else {
        dispatch({ type: "SET_HYDRATED" });
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      dispatch({ type: "SET_HYDRATED" });
    }
  }, []);

  const updateFormData = useCallback((formData: FormData) => {
    dispatch({ type: "SET_FORM_DATA", payload: formData });
  }, []);

  const updateFormField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      dispatch({ type: "SET_FORM_FIELD", field, value });
    },
    []
  );

  const updateRepairDetails = useCallback(
    <K extends keyof FormData["repairDetails"]>(
      field: K,
      value: FormData["repairDetails"][K]
    ) => {
      dispatch({ type: "SET_REPAIR_DETAIL", field, value });
    },
    []
  );

  const addToCart = useCallback(() => {
    dispatch({ type: "ADD_TO_CART" });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const resetFormData = useCallback(() => {
    dispatch({ type: "RESET_FORM" });
  }, []);

  const setEditingId = useCallback((id: string | null) => {
    dispatch({ type: "SET_EDITING_ID", id });
  }, []);

  const clearEditingId = useCallback(() => {
    dispatch({ type: "SET_EDITING_ID", id: null });
  }, []);

  const value: CartContextValue = {
    formData: state.formData,
    cart: state.cart,
    editingId: state.editingId,
    isHydrated: state.isHydrated,
    updateFormData,
    updateFormField,
    updateRepairDetails,
    addToCart,
    removeFromCart,
    clearCart,
    resetFormData,
    setEditingId,
    clearEditingId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}