import { db } from "@/lib/db";
import type { MovementInput } from "./types";

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

export function inTransaction<T>(
  work: (tx: InventoryTransaction) => Promise<T>,
) {
  return db.$transaction(work);
}

export type InventoryTransaction = Pick<
  typeof db,
  "material" | "stockMovement" | "user"
>;

export function findMaterial(tx: InventoryTransaction, id: string) {
  return tx.material.findUnique({
    where: { id },
    select: { archivedAt: true },
  });
}

export function findActor(tx: InventoryTransaction, id: string) {
  return tx.user.findUnique({ where: { id }, select: { id: true } });
}

export async function getBalance(tx: InventoryTransaction, materialId: string) {
  const result = await tx.stockMovement.aggregate({
    where: { materialId },
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}

export function findReceipt(tx: InventoryTransaction, purchaseOrderId: string) {
  return tx.stockMovement.findFirst({
    where: { purchaseOrderId, type: "RECEIPT" },
    select: { id: true },
  });
}

export function appendMovement(
  tx: InventoryTransaction,
  data: MovementInput & { id?: string; purchaseOrderId?: string },
) {
  return tx.stockMovement.create({ data, select: { id: true } });
}

export function countWasteMovements(start: Date, end: Date) {
  return db.stockMovement.groupBy({
    by: ["type"],
    where: {
      occurredAt: { gte: start, lt: end },
      type: { in: ["CONSUMPTION", "WASTE"] },
    },
    _count: { _all: true },
  });
}
