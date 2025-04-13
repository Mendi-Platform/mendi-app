import {
  RepairType,
  ServiceChoices,
  Garment,
  Material,
} from "@/types/formData";

export const getRepairTypeLabel = (type: RepairType): string => {
  switch (type) {
    case RepairType.ReplaceLock:
      return "Bytte glidelås";
    case RepairType.BigHole:
      return "Stort hull";
    case RepairType.SmallHole:
      return "Lite hull";
    case RepairType.NewButton:
      return "Sy på ny knapp";
    case RepairType.BeltHole:
      return "Fest på beltehemper";
    default:
      return "";
  }
};

export const getServiceLabel = (service: ServiceChoices): string => {
  switch (service) {
    case ServiceChoices.Reparation:
      return "Reparasjon";
    case ServiceChoices.Adjustment:
      return "Tilpasning";
    default:
      return "";
  }
};

export const getGarmentLabel = (garment: Garment): string => {
  switch (garment) {
    case Garment.Pants:
      return "Bukse";
    case Garment.Sweather:
      return "Genser";
    case Garment.Jacket:
      return "Jakke";
    case Garment.Dress:
      return "Kjole";
    case Garment.Shirt:
      return "Skjorte";
    case Garment.Blazer:
      return "Blazer";
    case Garment.Skirt:
      return "Skjørt";
    case Garment.Jeans:
      return "Jeans";
    case Garment.Frakk:
      return "Kåpe/Frakk";
    default:
      return "";
  }
};

export const getMaterialLabel = (material: Material): string => {
  switch (material) {
    case Material.Normal:
      return "Normale tekstiler";
    case Material.FalsktSkinn:
      return "Falskt skinn";
    case Material.Silke:
      return "Silke eller delikate tekstiler";
    case Material.Tjukke:
      return "Tjukke tekstiler";
    default:
      return "";
  }
};
