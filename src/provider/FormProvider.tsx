"use client";

import { createContext, useState } from "react";

export interface FormDataContextState {
  formData: FormData;
  updateFormData: (formData: FormData) => void;
}

export interface FormData {
  category: Category;
  service: ServiceChoices;
  repairType: RepairType;
  material: Material;
  garment: Garment;
}

export enum Garment {
  None,
  Pants,
  Sweather,
  Jacket,
  Dress,
  Shirt,
  Blazer,
  Skirt,
  Jeans,
  Frakk,
}

export enum Material {
  None,
  Normal,
  FalsktSkinn,
  Silke,
  Tjukke,
}

export enum RepairType {
  None,
  ReplaceLock,
  BigHole,
  SmallHole,
  NewButton,
  BeltHole,
}

export enum Category {
  None,
  Premium,
  Standard,
}

export enum ServiceChoices {
  None,
  Reparation,
  Adjustment,
}

const defaultFormDataContextState: FormDataContextState = {
  formData: {
    category: Category.None,
    service: ServiceChoices.None,
    repairType: RepairType.None,
    material: Material.None,
    garment: Garment.None,
  },
  updateFormData: () => {},
};

export const FormContext = createContext<FormDataContextState>(
  defaultFormDataContextState
);

export const FormProvider = ({ children }: { children?: React.ReactNode }) => {
  const [formData, setFormData] = useState<FormData>(
    defaultFormDataContextState.formData
  );

  const updateFormData = (formData: FormData) => {
    setFormData(formData);
  };

  const contextValue = {
    formData,
    updateFormData,
  };

  return (
    <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
  );
};
