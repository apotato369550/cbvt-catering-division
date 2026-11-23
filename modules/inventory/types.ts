export const MATERIAL_CATEGORIES = ["Produce", "Dry goods", "Dairy", "Protein"] as const;
export type MaterialCategory = (typeof MATERIAL_CATEGORIES)[number];

export const MOVEMENT_TYPES = ["RECEIPT", "CONSUMPTION", "WASTE", "ADJUSTMENT"] as const;
export type MovementType = (typeof MOVEMENT_TYPES)[number];

export type MaterialItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  reorderLevel: number | null;
  balance: number; // sum of all stock movements
  isLow: boolean; // balance is at or below the reorder level
};
