import { DomainError } from "../../lib/result";
import {
  countOrdersByStatus,
  findOrders,
  findRecentOrders,
} from "./repository";
import {
  ORDER_STATUSES,
  type OrderStatus,
  type PurchaseOrderItem,
  type RecentPurchaseOrder,
} from "./types";

const OPEN_STATUSES: OrderStatus[] = ["AWAITING", "CONFIRMED", "IN_TRANSIT"];

function parseOrderStatus(status: string): OrderStatus {
  const match = ORDER_STATUSES.find((known) => known === status);
  if (!match)
    throw new DomainError(`Unsupported purchase order status: ${status}`);
  return match;
}

export async function getOpenCount(): Promise<number> {
  return countOrdersByStatus(OPEN_STATUSES);
}

export async function getRecentOrders(
  limit: number,
): Promise<RecentPurchaseOrder[]> {
  if (!Number.isSafeInteger(limit) || limit < 0) {
    throw new RangeError("limit must be a non-negative safe integer");
  }
  if (limit === 0) return [];

  const orders = await findRecentOrders(limit);
  return orders.map(({ supplier, status, ...order }) => ({
    ...order,
    status: parseOrderStatus(status),
    supplierName: supplier.name,
  }));
}

export async function listOrders(): Promise<PurchaseOrderItem[]> {
  const rows = await findOrders();

  return rows.map((o) => ({
    id: o.id,
    poNumber: o.poNumber,
    supplierName: o.supplier.name,
    status: parseOrderStatus(o.status),
    expectedAt: o.expectedAt,
    lineCount: o._count.lines,
  }));
}
