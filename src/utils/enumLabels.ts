import {
  RepairType,
  ServiceChoices,
  Garment,
  Material,
} from "@/types/formData";

export const getRepairTypeLabel = (type: RepairType): string => {
  switch (type) {
    case RepairType.ReplaceZipper:
      return "Bytte glidelås";
    case RepairType.Hole:
      return "Hull";
    case RepairType.SewButton:
      return "Sy på ny knapp";
    case RepairType.BeltLoops:
      return "Fest på beltehemper";
    case RepairType.Hemming:
      return "Legge opp";
    case RepairType.AdjustWaist:
      return "Ta inn i livet";
    case RepairType.OtherRequest:
      return "Andre forespørsel";
    default:
      return "";
  }
};

export const getServiceLabel = (service: ServiceChoices): string => {
  switch (service) {
    case ServiceChoices.Repair:
      return "Reparasjon";
    case ServiceChoices.Adjustment:
      return "Tilpasning";
    default:
      return "";
  }
};

export const getGarmentLabel = (garment: Garment): string => {
  switch (garment) {
    case Garment.UpperBody:
      return "Overdel";
    case Garment.LowerBody:
      return "Underdel";
    case Garment.DressAndSuit:
      return "Kjole/dress";
    case Garment.OuterWear:
      return "Jakke/Yttertøy";
    case Garment.LeatherItems:
      return "Skinnplagg";
    default:
      return "";
  }
};

export const getMaterialLabel = (material: Material): string => {
  switch (material) {
    case Material.Normal:
      return "Normale tekstiler";
    case Material.FauxLeather:
      return "Falskt skinn";
    case Material.Silk:
      return "Silke eller delikate tekstiler";
    case Material.Thick:
      return "Tjukke tekstiler";
    default:
      return "";
  }
};
