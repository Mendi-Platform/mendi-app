// Slug-based types for Sanity integration
export type GarmentSlug =
  | ''
  | 'upper-body'
  | 'lower-body'
  | 'kjole'
  | 'dress'
  | 'outer-wear'
  | 'leather-items'
  | 'curtains';

export type RepairTypeSlug =
  | ''
  | 'replace-zipper'
  | 'sew-button'
  | 'small-hole'
  | 'big-hole'
  | 'hole'
  | 'belt-loops'
  | 'hemming'
  | 'adjust-waist'
  | 'other-request';

export type CategorySlug = '' | 'premium' | 'standard';

export type MaterialSlug = '' | 'normal' | 'faux-leather' | 'silk' | 'thick';

export type ServiceSlug = '' | 'repair' | 'adjustment';

export type MainCategorySlug = '' | 'clothes' | 'other-textiles';

export type TwoOptionSlug = '' | 'short' | 'long' | 'small' | 'big' | 'single' | 'multiple';

export interface FormData {
  categorySlug: CategorySlug;
  serviceSlug: ServiceSlug;
  repairTypeSlug: RepairTypeSlug;
  materialSlug: MaterialSlug;
  garmentSlug: GarmentSlug;
  mainCategorySlug: MainCategorySlug;
  description: string;
  repairDetails: RepairDetails;
  price?: number;
}

export interface RepairDetails {
  quantity?: number;
  option?: TwoOptionSlug;
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

// Legacy enums kept for backward compatibility during migration
// These will be removed once all pages are converted
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

// Helper to convert enum to slug (for migration)
export const garmentEnumToSlug: Record<Garment, GarmentSlug> = {
  [Garment.None]: '',
  [Garment.UpperBody]: 'upper-body',
  [Garment.LowerBody]: 'lower-body',
  [Garment.Kjole]: 'kjole',
  [Garment.Dress]: 'dress',
  [Garment.OuterWear]: 'outer-wear',
  [Garment.LeatherItems]: 'leather-items',
  [Garment.Curtains]: 'curtains',
};

export const repairTypeEnumToSlug: Record<RepairType, RepairTypeSlug> = {
  [RepairType.None]: '',
  [RepairType.ReplaceZipper]: 'replace-zipper',
  [RepairType.SewButton]: 'sew-button',
  [RepairType.SmallHole]: 'small-hole',
  [RepairType.BigHole]: 'big-hole',
  [RepairType.Hole]: 'hole',
  [RepairType.BeltLoops]: 'belt-loops',
  [RepairType.Hemming]: 'hemming',
  [RepairType.AdjustWaist]: 'adjust-waist',
  [RepairType.OtherRequest]: 'other-request',
};

export const categoryEnumToSlug: Record<Category, CategorySlug> = {
  [Category.None]: '',
  [Category.Premium]: 'premium',
  [Category.Standard]: 'standard',
};
