import * as repo from "./repository";
import type { OrderStatus, PurchaseOrderItem } from "./types";

export async function listOrders(): Promise<PurchaseOrderItem[]> {
  const rows = await repo.findOrders();

  return rows.map((o) => ({
    id: o.id,
    poNumber: o.poNumber,
    supplierName: o.supplier.name,
    status: o.status as OrderStatus,
    expectedAt: o.expectedAt,
    lineCount: o._count.lines,
  }));
}
