export const ORDER_STATUSES = [
  "AWAITING",
  "CONFIRMED",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type PurchaseOrderItem = {
  id: string;
  poNumber: string;
  supplierName: string;
  status: OrderStatus;
  expectedAt: Date | null;
  lineCount: number;
};

export type RecentPurchaseOrder = {
  poNumber: string;
  supplierName: string;
  status: OrderStatus;
  expectedAt: Date | null;
};
