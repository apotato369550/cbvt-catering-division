export const BATCH_STATUSES = ["QUEUED", "IN_PROGRESS", "RECORDED"] as const;
export type BatchStatus = (typeof BATCH_STATUSES)[number];

export type ProductionBatchItem = {
  id: string;
  name: string;
  productionDate: Date;
  createdAt: Date;
  scheduledAt: Date | null;
  targetPortions: number | null;
  portions: number;
  status: BatchStatus;
  notes: string | null;
  recordedBy: string; // name of the user who created it
};

export const BATCH_STATUS_LABELS: Record<BatchStatus, string> = {
  QUEUED: "Queued",
  IN_PROGRESS: "In progress",
  RECORDED: "Recorded",
};
