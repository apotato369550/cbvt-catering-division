import { db } from "../../lib/db";
import type { OrderStatus } from "./types";

export function countOrdersByStatus(statuses: OrderStatus[]) {
  return db.purchaseOrder.count({ where: { status: { in: statuses } } });
}

export function findRecentOrders(limit: number) {
  return db.purchaseOrder.findMany({
    orderBy: [{ createdAt: "desc" }, { poNumber: "asc" }],
    take: limit,
    select: {
      poNumber: true,
      supplier: { select: { name: true } },
      status: true,
      expectedAt: true,
    },
  });
}

export function findOrders() {
  return db.purchaseOrder.findMany({
    include: {
      supplier: { select: { name: true } },
      _count: { select: { lines: true } },
    },
    orderBy: { poNumber: "desc" },
  });
}
