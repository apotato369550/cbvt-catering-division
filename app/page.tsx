"use client";

import Link from "next/link";
import { useState } from "react";
import { KitchenShell } from "@/components/kitchen-shell";

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

export default function Page() {
  const [period, setPeriod] = useState("This week");
  const [showLog, setShowLog] = useState(false);
  const [notice, setNotice] = useState(true);

  return (
    <KitchenShell
      title="Good morning, Juan."
      eyebrow="Operations overview"
      description="A clear view of what’s moving, what needs attention, and what comes next."
      showPageIntro={false}
      action={
        <div className="flex items-center gap-3">
          <Link
            href="/production"
            className="hidden rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted sm:block"
          >
            View production
          </Link>
          <button
            onClick={() => setShowLog(true)}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm hover:brightness-95"
          >
            + Log activity
          </button>
        </div>
      }
    >
      <>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Operations overview
            </p>
            <h2 className="font-serif text-4xl font-bold tracking-tight">
              Your kitchen, at a glance.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              A clear view of what&apos;s moving, what needs attention, and what
              comes next.
            </p>
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm"
          >
            <option>This week</option>
            <option>This month</option>
            <option>Last week</option>
          </select>
        </div>
        {notice && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4">
            <div>
              <p className="text-sm font-semibold">
                3 ingredients need attention
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check low stock before tomorrow&apos;s prep schedule.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/inventory"
                className="text-sm font-semibold text-accent-foreground underline underline-offset-4"
              >
                Review inventory
              </Link>
              <button
                onClick={() => setNotice(false)}
                className="text-muted-foreground"
              >
                ×
              </button>
            </div>
          </div>
        )}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric
            label="Prep completion"
            value="78%"
            detail="+12% from last week"
            positive
          />
          <Metric
            label="Open purchase orders"
            value="12"
            detail="4 arriving today"
          />
          <Metric
            label="Low stock items"
            value="07"
            detail="3 need ordering"
            warning
          />
          <Metric
            label="Waste this week"
            value="2.4%"
            detail="-0.8% from last week"
            positive
          />
        </section>
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
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
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {period}
              </span>
            </div>
            <div className="flex h-52 items-end gap-3 border-b border-border pb-0 sm:gap-6">
              {[52, 66, 61, 78, 72, 88, 64].map((height, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-3"
                >
                  <div
                    className={`w-full rounded-t-md ${i === 5 ? "bg-accent" : "bg-primary/15"}`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="pb-3 text-xs text-muted-foreground">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-2 rounded-full bg-accent" /> 78% average
              completion{" "}
              <span className="ml-auto font-semibold text-accent-foreground">
                On track
              </span>
            </div>
          </section>
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Up next
                </p>
                <h3 className="mt-1 font-serif text-xl font-bold">
                  Prep schedule
                </h3>
              </div>
              <Link
                href="/production"
                className="text-sm font-semibold text-accent-foreground"
              >
                See all ↗
              </Link>
            </div>
            <div className="flex flex-col gap-5">
              {[
                ["10:00", "Sauce base", "In progress"],
                ["11:30", "Vegetable prep", "Queued"],
                ["14:00", "Dinner mise en place", "Queued"],
                ["16:30", "Final plating check", "Queued"],
              ].map(([time, title, status], i) => (
                <div key={title} className="flex gap-4">
                  <span className="w-12 pt-1 text-xs font-semibold text-muted-foreground">
                    {time}
                  </span>
                  <div className="relative flex-1 border-l border-border pl-4">
                    <p className="text-sm font-semibold">{title}</p>
                    <p
                      className={`mt-1 text-xs ${i === 0 ? "text-accent-foreground" : "text-muted-foreground"}`}
                    >
                      {status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <section className="mt-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Purchasing
              </p>
              <h3 className="mt-1 font-serif text-xl font-bold">
                Recent purchase orders
              </h3>
            </div>
            <Link
              href="/purchase-orders"
              className="text-sm font-semibold text-accent-foreground"
            >
              View all ↗
            </Link>
          </div>
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <Link
                href="/purchase-orders"
                key={order.id}
                className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/60"
              >
                <span className="w-20 font-mono text-xs font-semibold text-muted-foreground">
                  {order.id}
                </span>
                <span className="min-w-48 flex-1">
                  <strong className="block text-sm">{order.vendor}</strong>
                  <small className="text-xs text-muted-foreground">
                    {order.items}
                  </small>
                </span>
                <span className="text-sm text-muted-foreground">
                  {order.due}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {order.status}
                </span>
                <span className="text-muted-foreground">→</span>
              </Link>
            ))}
          </div>
        </section>
        {showLog && (
          <div className="fixed inset-0 z-20 grid place-items-center bg-primary/40 p-6">
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Quick entry
                  </p>
                  <h2 className="mt-1 font-serif text-2xl font-bold">
                    Log kitchen activity
                  </h2>
                </div>
                <button
                  onClick={() => setShowLog(false)}
                  aria-label="Close"
                  className="text-2xl text-muted-foreground"
                >
                  ×
                </button>
              </div>
              <div className="mt-6 flex flex-col gap-4">
                <label className="text-sm font-medium">
                  Activity type
                  <select className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-3">
                    <option>Production batch</option>
                    <option>Waste record</option>
                    <option>Stock count</option>
                  </select>
                </label>
                <label className="text-sm font-medium">
                  Notes
                  <textarea
                    className="mt-2 min-h-24 w-full rounded-lg border border-border bg-card px-3 py-3"
                    placeholder="Add a short note..."
                  />
                </label>
                <button
                  onClick={() => setShowLog(false)}
                  className="rounded-lg bg-accent py-3 text-sm font-bold text-accent-foreground"
                >
                  Save activity
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </KitchenShell>
  );
}

function Metric({
  label,
  value,
  detail,
  positive,
  warning,
}: {
  label: string;
  value: string;
  detail: string;
  positive?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-4 font-serif text-4xl font-bold">{value}</p>
      <p
        className={`mt-2 text-xs font-medium ${warning ? "text-accent-foreground" : positive ? "text-accent-foreground" : "text-muted-foreground"}`}
      >
        {positive ? "↑ " : warning ? "!" : ""}
        {detail}
      </p>
    </div>
  );
}
