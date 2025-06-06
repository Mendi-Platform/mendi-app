export interface FormData {
  category: Category;
  service: ServiceChoices;
  repairType: RepairType;
  material: Material;
  garment: Garment;
  mainCategory: MainCategory;
  description: string;
  repairDetails: RepairDetails;
  price?: number;
}

export interface RepairDetails {
  quantity?: number;
  option?: string;
  measurementMethod?: string;
  measurements?: string;
  images?: string[];
  additionalDetails?: string;
  email?: string;
  city?: string;
  detailsText?: string;
  damageMarkers?: DamageMarkers;
}

export interface DamageMarkers {
  front: { x: number; y: number }[];
  back: { x: number; y: number }[];
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
  Kjole,
  Dress,
  OuterWear,
  LeatherItems,
  Curtains
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
  SmallHole,
  BigHole,
  Hole,
  BeltLoops,
  Hemming,
  AdjustWaist,
  OtherRequest,
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
