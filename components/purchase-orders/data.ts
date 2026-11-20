
export type PurchaseOrder = {
  id: string;
  vendor: string;
  arrival: string;
  status: string;
};

export const initialOrders: PurchaseOrder[] = [
  {
    id: "PO-2048",
    vendor: "Fresh Fields Supply",
    arrival: "Today, 2:00 PM",
    status: "In transit",
  },
  {
    id: "PO-2047",
    vendor: "Cebu Grain Co.",
    arrival: "Tomorrow",
    status: "Confirmed",
  },
  {
    id: "PO-2046",
    vendor: "Island Dairy",
    arrival: "Sep 05",
    status: "Awaiting",
  },
];
