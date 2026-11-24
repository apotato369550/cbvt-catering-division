import * as repo from "./repository";
import type { BatchStatus, ProductionBatchItem } from "./types";

export async function listTodaysBatches(): Promise<ProductionBatchItem[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const rows = await repo.findBatchesBetween(start, end);

  return rows.map((b) => ({
    id: b.id,
    name: b.name,
    productionDate: b.productionDate,
    scheduledAt: b.scheduledAt,
    targetPortions: b.targetPortions,
    portions: b.portions,
    status: b.status as BatchStatus,
    notes: b.notes,
    recordedBy: b.createdBy.name,
  }));
}
