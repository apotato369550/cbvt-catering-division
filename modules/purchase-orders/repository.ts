import { db } from "@/lib/db";

export function findOrders() {
  return db.purchaseOrder.findMany({
    include: {
      supplier: { select: { name: true } },
      _count: { select: { lines: true } },
    },
    orderBy: { poNumber: "desc" },
  });
}
