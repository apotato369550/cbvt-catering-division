import { DomainError } from "../../lib/result";
import { MOVEMENT_TYPES } from "./types";
import * as repo from "./repository";
import type {
  InventoryPeriod,
  MaterialItem,
  MovementInput,
  ReceiptLine,
  WasteRates,
} from "./types";

export async function listActiveMaterials(): Promise<MaterialItem[]> {
  const [materials, balances] = await Promise.all([
    repo.findActiveMaterials(),
    repo.sumQuantityByMaterial(),
  ]);

  return materials.map((m) => {
    const balance = balances.get(m.id) ?? 0;
    return {
      id: m.id,
      name: m.name,
      category: m.category,
      unit: m.unit,
      reorderLevel: m.reorderLevel,
      balance,
      isLow: m.reorderLevel !== null && balance <= m.reorderLevel,
    };
  });
}

export const listMaterials = listActiveMaterials;

export async function getLowStock(): Promise<MaterialItem[]> {
  return (await listActiveMaterials()).filter((material) => material.isLow);
}

async function wasteRate(start: Date, end: Date): Promise<number | null> {
  const counts = await repo.countWasteMovements(start, end);
  const total = counts.reduce((sum, row) => sum + row._count._all, 0);
  const waste = counts.find((row) => row.type === "WASTE")?._count._all ?? 0;
  return total === 0 ? null : waste / total;
}

export async function getWasteRate({
  start,
  end,
}: InventoryPeriod): Promise<WasteRates> {
  const duration = end.getTime() - start.getTime();
  const previousStart = new Date(start.getTime() - duration);
  if (!(duration > 0) || !Number.isFinite(previousStart.getTime())) {
    throw new DomainError(
      "Waste rate requires a valid start and end date in order",
    );
  }
  const [current, previous] = await Promise.all([
    wasteRate(start, end),
    wasteRate(previousStart, start),
  ]);
  return { current, previous };
}

export async function recordMovement(input: MovementInput): Promise<string> {
  const { materialId, type, quantity, createdById, note } = input;
  if (
    !MOVEMENT_TYPES.includes(type) ||
    !Number.isFinite(quantity) ||
    (type === "ADJUSTMENT" ? quantity === 0 : quantity <= 0)
  ) {
    throw new DomainError("Invalid movement type or quantity");
  }

  const delta =
    type === "CONSUMPTION" || type === "WASTE" ? -quantity : quantity;
  return repo.inTransaction(async (tx) => {
    const material = await repo.findMaterial(tx, materialId);
    if (!material || material.archivedAt)
      throw new DomainError("Material is not active");
    if (!(await repo.findActor(tx, createdById)))
      throw new DomainError("Actor does not exist");
    const balance = await repo.getBalance(tx, materialId);
    if (!Number.isFinite(balance + delta) || balance + delta < 0) {
      throw new DomainError("Movement would leave an invalid stock balance");
    }
    const movement = await repo.appendMovement(tx, {
      materialId,
      type,
      quantity: delta,
      createdById,
      note,
    });
    return movement.id;
  });
}

export async function recordReceipt(
  poId: string,
  lines: readonly ReceiptLine[],
  transaction?: repo.InventoryTransaction,
): Promise<void> {
  const post = async (tx: repo.InventoryTransaction) => {
    if (await repo.findReceipt(tx, poId)) return;

    const actor = lines[0]?.createdById;
    if (!poId || !actor || !(await repo.findActor(tx, actor))) {
      throw new DomainError(
        "Receipt requires a purchase order, lines, and a valid actor",
      );
    }

    const quantities = new Map<string, number>();
    for (const line of lines) {
      const total = (quantities.get(line.materialId) ?? 0) + line.quantity;
      if (
        line.createdById !== actor ||
        line.quantity <= 0 ||
        !Number.isFinite(total)
      ) {
        throw new DomainError(
          "Receipt lines require positive quantities and the same actor",
        );
      }
      quantities.set(line.materialId, total);
    }
    for (const materialId of quantities.keys()) {
      if (!(await repo.findMaterial(tx, materialId)))
        throw new DomainError("Material does not exist");
    }

    let first = true;
    for (const [materialId, quantity] of quantities) {
      // A PO-wide key prevents duplicate posting even when concurrent payloads differ.
      await repo.appendMovement(tx, {
        ...(first ? { id: `po-receipt:${poId}` } : {}),
        purchaseOrderId: poId,
        materialId,
        quantity,
        type: "RECEIPT",
        createdById: actor,
      });
      first = false;
    }
  };

  if (transaction) await post(transaction);
  else await repo.inTransaction(post);
}
