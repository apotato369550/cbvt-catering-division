import { countOrdersByStatus, findRecentOrders } from "./repository";
import type { RecentPurchaseOrder } from "./types";

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
