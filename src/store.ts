import { create } from "zustand";
import {
  Category,
  FormData,
  Garment,
  Material,
  RepairType,
  ServiceChoices,
  MainCategory,
} from "./types/formData";

interface FormDataStore {
  formData: FormData;
  updateFormData: (formData: FormData) => void;
}

const useFormDataStore = create<FormDataStore>((set) => ({
  formData: {
    category: Category.None,
    service: ServiceChoices.None,
    repairType: RepairType.None,
    material: Material.None,
    garment: Garment.None,
    mainCategory: MainCategory.None,
    description: "",
    repairDetails: {
      quantity: undefined,
      option: undefined,
      measurementMethod: undefined,
      measurements: undefined,
    },
  },
  updateFormData: (formData: FormData) => set({ formData }),
}));

export default useFormDataStore;
