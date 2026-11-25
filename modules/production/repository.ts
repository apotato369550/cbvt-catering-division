import { db } from "@/lib/db";

// Voided batches are never returned.
export function findBatchesBetween(
  start: Date,
  end: Date,
  order: "newest" | "scheduled" = "scheduled",
) {
  return db.productionBatch.findMany({
    where: { voidedAt: null, productionDate: { gte: start, lt: end } },
    include: { createdBy: { select: { name: true } } },
    orderBy:
      order === "newest"
        ? [{ createdAt: "desc" }, { id: "desc" }]
        : [{ scheduledAt: "asc" }, { createdAt: "asc" }],
  });
}
