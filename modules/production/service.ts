import { DomainError } from "../../lib/result";
import { BATCH_STATUSES } from "./types";
import { countByStatus, findBatchesBetween, findSchedule } from "./repository";
import type {
  BatchStatus,
  ProductionBatchItem,
  ProductionPeriod,
  ProductionScheduleEntry,
} from "./types";

const manilaDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Manila",
  calendar: "gregory",
  numberingSystem: "latn",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});
const DAY_MS = 86_400_000;
const MANILA_OFFSET_MS = 8 * 3_600_000;

function todayInManila(): ProductionPeriod {
  const parts = manilaDate.formatToParts(new Date());
  const part = (type: "year" | "month" | "day") =>
    Number(parts.find((entry) => entry.type === type)?.value);
  // Present-day Manila uses UTC+08:00 with no daylight saving time.
  const midnight =
    Date.UTC(part("year"), part("month") - 1, part("day")) - MANILA_OFFSET_MS;
  return { start: new Date(midnight), end: new Date(midnight + DAY_MS) };
}

function compareSchedule(
  a: ProductionScheduleEntry,
  b: ProductionScheduleEntry,
) {
  if (a.scheduledAt && b.scheduledAt) {
    const difference = a.scheduledAt.getTime() - b.scheduledAt.getTime();
    if (difference !== 0) return difference;
  } else if (a.scheduledAt || b.scheduledAt) {
    return a.scheduledAt ? -1 : 1;
  }

  return (
    a.productionDate.getTime() - b.productionDate.getTime() ||
    (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)
  );
}

function parseBatchStatus(status: string): BatchStatus {
  const match = BATCH_STATUSES.find((known) => known === status);
  if (!match)
    throw new DomainError(`Unsupported production batch status: ${status}`);
  return match;
}

export async function getTodaySchedule(): Promise<ProductionScheduleEntry[]> {
  const batches = await findSchedule(todayInManila());
  return batches
    .map((batch) => ({
      ...batch,
      status: parseBatchStatus(batch.status),
    }))
    .sort(compareSchedule);
}

export async function getCompletion(period: ProductionPeriod): Promise<number> {
  const start = period.start.getTime();
  const end = period.end.getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) {
    throw new RangeError("period must have valid dates with start before end");
  }

  const counts = await countByStatus(period);
  const total = counts.reduce((sum, group) => sum + group._count._all, 0);
  const recorded =
    counts.find((group) => group.status === "RECORDED")?._count._all ?? 0;
  return total === 0 ? 0 : recorded / total;
}

export async function listTodaysBatches(): Promise<ProductionBatchItem[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const rows = await repo.findBatchesBetween(start, end, "newest");

  return rows.map((b) => ({
    id: b.id,
    name: b.name,
    productionDate: b.productionDate,
    createdAt: b.createdAt,
    scheduledAt: b.scheduledAt,
    targetPortions: b.targetPortions,
    portions: b.portions,
    status: b.status as BatchStatus,
    notes: b.notes,
    recordedBy: b.createdBy.name,
  }));
}
