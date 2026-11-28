import { periods, type Period } from "./period";

const orders = [
  {
    id: "PO-2048",
    vendor: "Fresh Fields Supply",
    items: "Produce · 18 items",
    due: "Today, 2:00 PM",
    status: "In transit",
  },
  {
    id: "PO-2047",
    vendor: "Cebu Grain Co.",
    items: "Rice & dry goods · 6 items",
    due: "Tomorrow",
    status: "Confirmed",
  },
  {
    id: "PO-2046",
    vendor: "Island Dairy",
    items: "Dairy · 9 items",
    due: "Sep 05",
    status: "Awaiting",
  },
];

const productionData = [
  { day: "Mon", completion: 52 },
  { day: "Tue", completion: 66 },
  { day: "Wed", completion: 61 },
  { day: "Thu", completion: 78 },
  { day: "Fri", completion: 72 },
  { day: "Sat", completion: 88 },
  { day: "Sun", completion: 64 },
];

const prepSchedule = [
  {
    time: "10:00",
    title: "Sauce base",
    status: "In progress",
  },
  {
    time: "11:30",
    title: "Vegetable prep",
    status: "Queued",
  },
  {
    time: "14:00",
    title: "Dinner mise en place",
    status: "Queued",
  },
  {
    time: "16:30",
    title: "Final plating check",
    status: "Queued",
  },
];

const reports = {
  "this-week": { offset: 0, waste: "2.4%" },
  "this-month": { offset: 6, waste: "3.1%" },
  "last-week": { offset: -8, waste: "3.2%" },
} satisfies Record<Period, { offset: number; waste: string }>;

export async function loadOverview(period: Period) {
  const report = reports[period];
  const chart = productionData.map(({ day, completion }) => ({
    day,
    completion: completion + report.offset,
  }));
  const average = Math.round(
    chart.reduce((sum, point) => sum + point.completion, 0) / chart.length,
  );
  return {
    chart,
    average,
    orders,
    prepSchedule,
    notice: {
      title: "3 ingredients need attention",
      description: "Check low stock before tomorrow’s prep schedule.",
      href: "/inventory",
      linkLabel: "Review inventory",
    },
    metrics: [
      {
        label: "Prep completion",
        value: `${average}%`,
        detail: periods[period],
      },
      {
        label: "Open purchase orders",
        value: "12",
        detail: "4 arriving today",
      },
      {
        label: "Low stock items",
        value: "07",
        detail: "3 need ordering",
        warning: true,
      },
      { label: "Waste", value: report.waste, detail: periods[period] },
    ],
  };
}
