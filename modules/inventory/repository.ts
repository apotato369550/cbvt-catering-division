import { db } from "@/lib/db";

export function findActiveMaterials() {
  return db.material.findMany({
    where: { archivedAt: null },
    orderBy: { name: "asc" },
  });
}

// Stock balance = sum of every movement (receipts are +, consumption and waste are -).
export async function sumQuantityByMaterial() {
  const rows = await db.stockMovement.groupBy({
    by: ["materialId"],
    _sum: { quantity: true },
  });
  return new Map(rows.map((r) => [r.materialId, r._sum.quantity ?? 0]));
}
