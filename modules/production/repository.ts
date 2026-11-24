import { db } from "../../lib/db";
import type { ProductionPeriod } from "./types";

function eligibleBatches({ start, end }: ProductionPeriod) {
  return { productionDate: { gte: start, lt: end }, voidedAt: null };
}

export function findSchedule(period: ProductionPeriod) {
  return db.productionBatch.findMany({
    where: eligibleBatches(period),
    select: { id: true, name: true, status: true, productionDate: true, scheduledAt: true },
  });
}

export function countByStatus(period: ProductionPeriod) {
  return db.productionBatch.groupBy({
    by: ["status"],
    where: eligibleBatches(period),
    _count: { _all: true },
  });
}
