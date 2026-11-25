// Public API of the inventory module. Other modules and pages import from here only.
export {
  getLowStock,
  getWasteRate,
  listActiveMaterials,
  listMaterials,
  recordMovement,
  recordReceipt,
} from "./service";
export { MATERIAL_CATEGORIES, MOVEMENT_TYPES } from "./types";
export type {
  InventoryPeriod,
  MaterialCategory,
  MaterialItem,
  MovementInput,
  MovementType,
  ReceiptLine,
  WasteRates,
} from "./types";
