// Public API of the inventory module. Other modules and pages import from here only.
export { listMaterials } from "./service";
export { MATERIAL_CATEGORIES, MOVEMENT_TYPES } from "./types";
export type { MaterialCategory, MaterialItem, MovementType } from "./types";
