export const BATCH_STATUSES = ["QUEUED", "IN_PROGRESS", "RECORDED"] as const;
export type BatchStatus = (typeof BATCH_STATUSES)[number];

export type ProductionBatchItem = {
  id: string;
  name: string;
  productionDate: Date;
  scheduledAt: Date | null;
  targetPortions: number | null;
  portions: number;
  status: BatchStatus;
  notes: string | null;
  recordedBy: string; // name of the user who created it
};

export type ProductionPeriod = { start: Date; end: Date };

export type ProductionScheduleEntry = {
  id: string;
  name: string;
  status: BatchStatus;
  productionDate: Date;
  scheduledAt: Date | null;
};
