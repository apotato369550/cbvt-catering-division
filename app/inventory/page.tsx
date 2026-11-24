import { db } from "@/lib/db";
import InventoryClient from "./inventory-client";

// Always read fresh data instead of caching the page at build time
export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const materials = await db.material.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, category: true, unit: true },
  });

  return <InventoryClient materials={materials} />;
}
