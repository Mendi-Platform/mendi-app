export interface FormData {
  category: Category;
  service: ServiceChoices;
  repairType: RepairType;
  material: Material;
  garment: Garment;
  mainCategory: MainCategory;
  description: string;
  repairDetails: RepairDetails;
}

export interface RepairDetails {
  quantity?: number;
  option?: string;
  measurementMethod?: string;
  measurements?: string;
  images?: string[];
}

export enum TwoOptionType {
  None = "",
  Short = "short",
  Long = "long",
  Small = "small",
  Big = "big",
  SingleLayer = "single",
  MultipleLayers = "multiple"
}

export enum Garment {
  None,
  UpperBody,
  LowerBody,
  DressAndSuit,
  OuterWear,
  LeatherItems
}

export enum Material {
  None,
  Normal,
  FauxLeather,
  Silk,
  Thick,
}

export enum RepairType {
  None,
  ReplaceZipper,
  SewButton,
  Hole,
  BeltLoops,
  Hemming,
  AdjustWaist,
  OtherRequest
}

export enum Category {
  None,
  Premium,
  Standard,
}

export enum ServiceChoices {
  None,
  Repair,
  Adjustment,
}

export enum MainCategory {
  None,
  Clothes,
  OtherTextiles
}
