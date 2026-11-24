import { db } from "../../lib/db";

export function countOrdersByStatus(statuses: string[]) {
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
