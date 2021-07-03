export interface Equipment {
  Id: number;
  En: string;
  Jp: string;
  EnFull: string;
  JpFull: string;
  IsWAR: boolean;
  IsMNK: boolean;
  IsWHM: boolean;
  IsBLM: boolean;
  IsRDM: boolean;
  IsTHF: boolean;
  IsPLD: boolean;
  IsDRK: boolean;
  IsBST: boolean;
  IsBRD: boolean;
  IsRNG: boolean;
  IsSAM: boolean;
  IsNIN: boolean;
  IsDRG: boolean;
  IsSMN: boolean;
  IsBLU: boolean;
  IsCOR: boolean;
  IsPUP: boolean;
  IsDNC: boolean;
  IsSCH: boolean;
  IsGEO: boolean;
  IsRUN: boolean;
  Level: number;
  Slots?: number;
  ItemLevel?: number;
  SuLevel?: number;
  Skill?: number;
  // Properties
  EnDescription?: string | null;
  JpDescription?: string | null;
  Damage?: number;
  ShieldSize?: number;
  Flags?: number;
  // Augments
  AugMultiRand?: string;
  AugRange?: string;
  AugFixed?: string;
  // Combination
  CombGroupID?: number;
}

export type Property =
    {
      PropID:number;
      CatID:number;
      MinValue?:number;
      Value?:number;
      Unit?:string;
    }

export interface EquipSet extends Record<string, Equipment> {
  Main?: Equipment;
  Sub?: Equipment;
  Range?: Equipment;
  Ammo?: Equipment;
  Head?: Equipment;
  Body?: Equipment;
  Hands?: Equipment;
  Legs?: Equipment;
  Feet?: Equipment;
  Neck?: Equipment;
  Waist?: Equipment;
  "L.Earring"?: Equipment;
  "R.Earring"?: Equipment;
  "L.Ring"?: Equipment;
  "R.Ring"?: Equipment;
  Cape?: Equipment;
}

export interface PropertyInfo {
  name: string;
  hasValue: boolean;
  valueUnit?: string;
  value?: number;
}

export interface Limiter {
  index: number;
  property: string | null;
  minValue: number;
  isActive: boolean;
  isSort: boolean;
  isText: boolean;
  isProp: boolean;
  isAsc: boolean;
}
