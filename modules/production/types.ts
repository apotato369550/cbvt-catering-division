export type ProductionPeriod = { start: Date; end: Date };

export type ProductionScheduleEntry = {
  id: string;
  name: string;
  status: string;
  productionDate: Date;
  scheduledAt: Date | null;
};
