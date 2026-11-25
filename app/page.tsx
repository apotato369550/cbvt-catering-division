import Link from "next/link";

import { KitchenShell } from "@/components/kitchen-shell";

import { OverviewNotice } from "@/components/overview/overview-notice";
import { OverviewMetrics } from "@/components/overview/overview-metrics";
import { ProductionOverview } from "@/components/overview/overview-production";
import { PrepSchedule } from "@/components/overview/overview-schedule";
import { RecentOrders } from "@/components/overview/overvoew-recent-orders";
import { OverviewActivity } from "@/components/overview/overview-activity";
import { loadOverview } from "./_overview/load-overview";
import { resolvePeriod } from "./_overview/period";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ period?: string | string[] }>;
}) {
  const period = resolvePeriod((await searchParams).period);
  const data = await loadOverview(period);

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

          <OverviewActivity />
        </div>
      }
    >
      <div className="mb-8 flex items-end justify-between gap-4">
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
      </div>

      <div className="space-y-6">
        <OverviewNotice notice={data.notice} />

        <OverviewMetrics metrics={data.metrics} />

        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <ProductionOverview
            period={period}
            chart={data.chart}
            average={data.average}
          />
          <PrepSchedule items={data.prepSchedule} />
        </div>

        <RecentOrders orders={data.orders} />
      </div>
    </KitchenShell>
  );
}
