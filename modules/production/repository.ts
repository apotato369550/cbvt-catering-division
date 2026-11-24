import { db } from "@/lib/db";

// Voided batches are never returned.
export function findBatchesBetween(start: Date, end: Date) {
  return db.productionBatch.findMany({
    where: { voidedAt: null, productionDate: { gte: start, lt: end } },
    include: { createdBy: { select: { name: true } } },
    orderBy: [{ scheduledAt: "asc" }, { createdAt: "asc" }],
  });
}
