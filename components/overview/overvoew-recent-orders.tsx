import Link from "next/link";

export function RecentOrders({
  orders,
}: {
  orders: {
    id: string;
    vendor: string;
    items: string;
    due: string;
    status: string;
  }[];
}) {
  return (
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

            <span className="text-sm text-muted-foreground">{order.due}</span>

            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
              {order.status}
            </span>

            <span className="text-muted-foreground">→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
