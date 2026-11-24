import { countOrdersByStatus, findOrders, findRecentOrders } from "./repository";
import type { OrderStatus, PurchaseOrderItem, RecentPurchaseOrder } from "./types";

const OPEN_STATUSES = ["AWAITING", "CONFIRMED", "IN_TRANSIT"];

export async function getOpenCount(): Promise<number> {
  return countOrdersByStatus(OPEN_STATUSES);
}

export async function getRecentOrders(limit: number): Promise<RecentPurchaseOrder[]> {
  if (!Number.isSafeInteger(limit) || limit < 0) {
    throw new RangeError("limit must be a non-negative safe integer");
  }
  if (limit === 0) return [];

  const orders = await findRecentOrders(limit);
  return orders.map(({ supplier, ...order }) => ({
    ...order,
    supplierName: supplier.name,
  }));
}

export async function listOrders(): Promise<PurchaseOrderItem[]> {
  const rows = await findOrders();

  return rows.map((o) => ({
    id: o.id,
    poNumber: o.poNumber,
    supplierName: o.supplier.name,
    status: o.status as OrderStatus,
    expectedAt: o.expectedAt,
    lineCount: o._count.lines,
  }));
}
