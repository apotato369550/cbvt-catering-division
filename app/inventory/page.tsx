import { listMaterials } from "@/modules/inventory";
import InventoryClient from "./inventory-client";

// Always read fresh data instead of caching the page at build time.
export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  // listMaterials() already leaves out archived materials.
  const materials = await listMaterials();
  return <InventoryClient materials={materials} />;
}
