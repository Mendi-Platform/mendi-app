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
