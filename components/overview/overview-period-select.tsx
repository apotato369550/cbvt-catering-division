"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { periods, type Period } from "@/app/_overview/period";

export function OverviewPeriodSelect({ period }: { period: Period }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div>
      <select
        aria-label="Reporting period"
        value={period}
        disabled={pending}
        onChange={(event) => {
          const params = new URLSearchParams(window.location.search);
          params.set("period", event.target.value);
          startTransition(() => router.push(`/?${params}`, { scroll: false }));
        }}
        className="rounded-lg border border-border bg-card px-3 py-2 text-xs"
      >
        {Object.entries(periods).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <span role="status" className="ml-2 text-xs">
        {pending ? "Updating…" : ""}
      </span>
    </div>
  );
}
