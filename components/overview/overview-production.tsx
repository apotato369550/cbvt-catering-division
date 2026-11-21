
"use client";

import { useState } from "react";
import { productionData } from "./data";

export function ProductionOverview() {
  const [period, setPeriod] = useState("This week");

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Production pace
          </p>

          <h3 className="mt-1 font-serif text-xl font-bold">
            Prep completion
          </h3>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-xs"
        >
          <option>This week</option>
          <option>This month</option>
          <option>Last week</option>
        </select>
      </div>

      <div className="flex h-52 items-end gap-3 border-b border-border pb-0 sm:gap-6">
        {productionData.map((item, i) => (
          <div
            key={item.day}
            className="flex flex-1 flex-col items-center gap-3"
          >
            <div
              className={`w-full rounded-t-md ${
                i === 5 ? "bg-accent" : "bg-primary/15"
              }`}
              style={{ height: `${item.completion}%` }}
            />

            <span className="pb-3 text-xs text-muted-foreground">
              {item.day}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="size-2 rounded-full bg-accent" />

        78% average completion

        <span className="ml-auto font-semibold text-accent-foreground">
          On track
        </span>
      </div>
    </section>
  );
}
