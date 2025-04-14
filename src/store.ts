import { create } from "zustand";
import {
  Category,
  FormData,
  Garment,
  Material,
  RepairType,
  ServiceChoices,
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
    description: "",
  },
  updateFormData: (formData: FormData) => set({ formData }),
}));

export default useFormDataStore;
