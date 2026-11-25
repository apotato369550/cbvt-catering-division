export const periods = {
  "this-week": "This week",
  "this-month": "This month",
  "last-week": "Last week",
} as const;
export type Period = keyof typeof periods;
export function resolvePeriod(value: string | string[] | undefined): Period {
  return value === "this-month" || value === "last-week" ? value : "this-week";
}
