export const ORDER_STATUSES = [
  "AWAITING",
  "CONFIRMED",
  "IN_TRANSIT",
  "DELIVERED",
  "CANCELLED",
] as const;

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  AWAITING: "Awaiting",
  CONFIRMED: "Confirmed",
  IN_TRANSIT: "In transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type PurchaseOrderItem = {
  id: string;
  poNumber: string;
  supplierName: string;
  status: OrderStatus;
  expectedAt: Date | null;
  lineCount: number;
};
